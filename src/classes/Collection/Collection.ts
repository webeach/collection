import { CollectionUpdateEvent } from '../CollectionUpdateEvent';
import { HookDispatcher } from '../HookDispatcher';
import { $CollectionHookDispatcherSymbol } from './constants';
import {
  CollectionBaseItemData,
  CollectionDefaultKeyType,
  CollectionHookOperationType,
  CollectionHookParamsMap,
  CollectionHookParamsMeta,
  CollectionItem,
  CollectionOptions,
  CollectionPrimaryKeyWithDefault,
  CollectionUpdateEventHandler,
} from './types';

/**
 * A strongly-typed collection of items keyed by a primary key, with lifecycle hooks
 * and `update` event notifications.
 *
 * @remarks
 * **Hooks**
 *
 * Every mutating method dispatches lifecycle hooks (`<action>:before` /
 * `<action>:after`) through `[$CollectionHookDispatcherSymbol]`. Returning
 * `false` from a `before` hook cancels the operation; the corresponding
 * `after` hook is not dispatched and no `update` event is emitted.
 *
 * **Update event**
 *
 * On every successful mutation a `CollectionUpdateEvent` is dispatched first
 * to the `onUpdate` callback and then to `addEventListener('update', ...)`
 * listeners.
 *
 * **Replace-on-insert is silent**
 *
 * When an `append`/`insert`-style method receives an item whose primary key
 * already exists, the existing item is removed *silently* (no `remove:*`
 * hooks are dispatched) — replacement is considered part of the insert
 * operation, not a separate remove.
 *
 * @template PrimaryKey - Name of the primary key field.
 * @template PrimaryKeyType - Type of the primary key value.
 * @template ItemData - Shape of the item data.
 */
export class Collection<
  PrimaryKey extends string = 'key',
  PrimaryKeyType = CollectionDefaultKeyType,
  ItemData extends CollectionBaseItemData<PrimaryKey, PrimaryKeyType> =
    CollectionBaseItemData<PrimaryKey, PrimaryKeyType>,
> extends EventTarget {
  /**
   * Callback invoked with a `CollectionUpdateEvent` after every successful
   * mutation. Set to `null` to unsubscribe.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/properties/onUpdate.md
   */
  public onUpdate: CollectionUpdateEventHandler<
    CollectionPrimaryKeyWithDefault<PrimaryKey>,
    PrimaryKeyType,
    ItemData
  > | null = null;

  /**
   * Hook dispatcher exposed via a unique symbol. Use `register(...)` on it to
   * subscribe to lifecycle hooks of this collection.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/hooks/insert.md
   */
  public [$CollectionHookDispatcherSymbol] = new HookDispatcher<
    CollectionHookOperationType,
    CollectionHookParamsMap<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >
  >();

  /**
   * Internal mutable array of items in insertion order. All mutating
   * methods (`_appendItem`, `_clear`, etc.) operate on this array directly.
   *
   * Never expose this reference to the outside world — use the public
   * {@link items} getter (which returns the frozen {@link itemsSnapshot})
   * instead.
   */
  protected readonly currentItems: CollectionItem<
    CollectionPrimaryKeyWithDefault<PrimaryKey>,
    PrimaryKeyType,
    ItemData
  >[] = [];

  /** Initial items captured from options; used by {@link reset}. */
  protected readonly initialItems: CollectionItem<
    CollectionPrimaryKeyWithDefault<PrimaryKey>,
    PrimaryKeyType,
    ItemData
  >[];

  /** Primary-key index for O(1) lookups. */
  protected readonly itemsByMap = new Map<
    CollectionDefaultKeyType | unknown,
    CollectionItem<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >
  >();

  /** Field name used as the primary key. */
  protected readonly primaryKey: PrimaryKey extends never ? 'key' : PrimaryKey;

  /** Frozen meta object passed to every hook. */
  private readonly hookMeta: CollectionHookParamsMeta<
    CollectionPrimaryKeyWithDefault<PrimaryKey>
  >;

  /**
   * Frozen, public-facing snapshot of {@link currentItems}. Re-created by
   * {@link _updateItemsSnapshot} once per successful mutation, right before
   * `update` event dispatch.
   *
   * The reference is stable between mutations — `forEach`, `[Symbol.iterator]`,
   * the public {@link items} getter and `CollectionUpdateEvent.detail` all
   * share this same array. Comparing `collection.items === previous` is a
   * cheap O(1) change check.
   */
  private itemsSnapshot: ReadonlyArray<
    CollectionItem<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >
  > = [];

  /**
   * @param options - Configuration:
   * - `initialItems` — items to populate the collection with.
   * - `primaryKey` — field name used as the unique identifier (defaults to `'key'`).
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/constructor.md
   */
  constructor(
    options: CollectionOptions<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    > = {},
  ) {
    super();

    const { initialItems = [], primaryKey } = options;

    this.initialItems = initialItems.slice();
    this.primaryKey =
      primaryKey ?? ('key' as CollectionPrimaryKeyWithDefault<PrimaryKey>);

    this.hookMeta = Object.freeze({
      primaryKey: this.primaryKey,
    });

    this._setItems(this.initialItems);
    this._updateItemsSnapshot();
  }

  /**
   * Appends `item` to the end (or replaces an existing item with the same key).
   *
   * @returns `true` if the item was inserted; `false` if validation failed
   * or an `insert:before` hook cancelled the operation.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/methods/appendItem.md
   */
  public appendItem(
    item: CollectionItem<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >,
  ) {
    if (!this._appendItem(item)) {
      return false;
    }

    this._dispatchUpdate();

    return true;
  }

  /**
   * Appends `item` at the given `index` (clamped to `[0, numItems]`).
   *
   * @returns `true` if the item was inserted; otherwise `false`.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/methods/appendItemAt.md
   */
  public appendItemAt(
    item: CollectionItem<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >,
    index: number,
  ) {
    if (!this._appendItem(item, index)) {
      return false;
    }

    this._dispatchUpdate();

    return true;
  }

  /**
   * Removes all items.
   *
   * @returns `true` if the collection was cleared; `false` if it was already
   * empty or a `clear:before` hook cancelled the operation.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/methods/clear.md
   */
  public clear() {
    if (!this._clear()) {
      return false;
    }

    this._dispatchUpdate();

    return true;
  }

  /**
   * Iterates over a snapshot of the items.
   *
   * @param callback - Receives `(item, index, currentItems)` for each item.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/methods/forEach.md
   */
  public forEach(
    callback: (
      item: Readonly<
        CollectionItem<
          CollectionPrimaryKeyWithDefault<PrimaryKey>,
          PrimaryKeyType,
          ItemData
        >
      >,
      index: number,
      currentItems: ReadonlyArray<
        CollectionItem<
          CollectionPrimaryKeyWithDefault<PrimaryKey>,
          PrimaryKeyType,
          ItemData
        >
      >,
    ) => void,
  ) {
    this.itemsSnapshot.forEach(callback);
  }

  /**
   * Retrieves an item by its primary key.
   *
   * @returns The item or `null` when not found.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/methods/getItem.md
   */
  public getItem(key: PrimaryKeyType | unknown) {
    return this.itemsByMap.get(key) ?? null;
  }

  /**
   * Checks whether an item with the given primary key exists.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/methods/hasItem.md
   */
  public hasItem(key: PrimaryKeyType | unknown) {
    return this.itemsByMap.has(key);
  }

  /**
   * Inserts `item` immediately after the item with the given `key`.
   * If the target is missing, the item is appended.
   *
   * @returns `true` if the item was inserted; otherwise `false`.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/methods/insertItemAfter.md
   */
  public insertItemAfter(
    key: PrimaryKeyType,
    item: CollectionItem<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >,
  ) {
    if (!this._insertItem(key, item, true)) {
      return false;
    }

    this._dispatchUpdate();

    return true;
  }

  /**
   * Inserts `item` immediately before the item with the given `key`.
   * If the target is missing, the item is appended.
   *
   * @returns `true` if the item was inserted; otherwise `false`.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/methods/insertItemBefore.md
   */
  public insertItemBefore(
    key: PrimaryKeyType,
    item: CollectionItem<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >,
  ) {
    if (!this._insertItem(key, item, false)) {
      return false;
    }

    this._dispatchUpdate();

    return true;
  }

  /**
   * Partially updates an existing item.
   *
   * @remarks
   * Mutates the existing object reference in place via `Object.assign` — any
   * external references to the same item will observe the changes. The primary
   * key field is forcibly preserved; attempts to change it via `patchData` are
   * silently overridden (and a `console.error` is emitted).
   *
   * @returns `true` if the item was found and patched; otherwise `false`.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/methods/patchItem.md
   */
  public patchItem(
    key: PrimaryKeyType,
    patchData: Partial<
      Omit<ItemData, CollectionPrimaryKeyWithDefault<PrimaryKey>>
    >,
  ) {
    if (!this._patchItem(key, patchData)) {
      return false;
    }

    this._dispatchUpdate();

    return true;
  }

  /**
   * Prepends `item` to the beginning (or replaces an existing item with the same key).
   *
   * @returns `true` if the item was inserted; otherwise `false`.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/methods/prependItem.md
   */
  public prependItem(
    item: CollectionItem<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >,
  ) {
    if (!this._appendItem(item, 0)) {
      return false;
    }

    this._dispatchUpdate();

    return true;
  }

  /**
   * Removes an item by its primary key.
   *
   * @returns `true` if the item was found and removed; `false` if it does not
   * exist or a `remove:before` hook cancelled the operation.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/methods/removeItem.md
   */
  public removeItem(key: PrimaryKeyType | unknown) {
    if (!this._removeItem(key)) {
      return false;
    }

    this._dispatchUpdate();

    return true;
  }

  /**
   * Replaces the item identified by `key` with `item`. If the target is missing,
   * `item` is appended to the end.
   *
   * @returns `true` if the operation succeeded; otherwise `false`.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/methods/replaceItem.md
   */
  public replaceItem(
    key: PrimaryKeyType,
    item: CollectionItem<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >,
  ) {
    if (!this._replaceItem(key, item)) {
      return false;
    }

    this._dispatchUpdate();

    return true;
  }

  /**
   * Resets the collection back to its `initialItems`.
   *
   * @returns `true` if the operation completed; `false` if a `clear:before`
   * hook cancelled it.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/methods/reset.md
   */
  public reset() {
    if (this._reset() === null) {
      return false;
    }

    this._dispatchUpdate();

    return true;
  }

  /**
   * Replaces all items with the provided ones (clears first, then inserts).
   *
   * @returns The number of items successfully inserted (may be `0` if `items`
   * is empty but the operation still ran). Returns `0` and skips dispatching
   * `update` if the initial `clear:before` hook cancelled the operation.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/methods/setItems.md
   */
  public setItems(
    items: CollectionItem<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >[],
  ) {
    const insertedCount = this._setItems(items);

    if (insertedCount === null) {
      return 0;
    }

    this._dispatchUpdate();

    return insertedCount;
  }

  /**
   * Read-only snapshot of the current items.
   *
   * @remarks
   * Returns a frozen array that is replaced (not mutated) after every
   * successful mutation. The reference is stable between mutations, so
   * `collection.items === previousItems` is a cheap O(1) change check.
   *
   * The same reference is exposed as `CollectionUpdateEvent.detail`, so
   * inside an `update` listener `event.detail === collection.items` holds
   * until the next mutation.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/properties/items.md
   */
  public get items() {
    return this.itemsSnapshot;
  }

  /**
   * Current number of items.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/properties/numItems.md
   */
  public get numItems() {
    return this.currentItems.length;
  }

  /**
   * Iterator over a snapshot of the items, enabling `for...of` usage.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/methods/[Symbol.iterator].md
   */
  public [Symbol.iterator]() {
    return this.itemsSnapshot[Symbol.iterator]();
  }

  /**
   * Inserts an item at the given index. If an item with the same key already
   * exists, it is removed *silently* (no `remove:*` hooks) before insertion.
   */
  protected _appendItem(
    item: CollectionItem<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >,
    index = this.numItems,
  ) {
    if (!this._validateItem(item)) {
      return false;
    }

    const normalizedIndex = Math.min(Math.max(index, 0), this.numItems);

    if (
      !this[$CollectionHookDispatcherSymbol].dispatch('insert:before', {
        item,
        index: normalizedIndex,
        meta: this.hookMeta,
      })
    ) {
      return false;
    }

    const key = item[this.primaryKey];

    // Silently evict the existing item with the same key (replace semantics).
    if (this.hasItem(key)) {
      const existing = this.itemsByMap.get(key)!;
      const existingIndex = this.currentItems.indexOf(existing);

      this.currentItems.splice(existingIndex, 1);
      this.itemsByMap.delete(key);
    }

    // Re-clamp after potential silent removal.
    const finalIndex = Math.min(normalizedIndex, this.numItems);

    this.currentItems.splice(finalIndex, 0, item);
    this.itemsByMap.set(key, item);

    this[$CollectionHookDispatcherSymbol].dispatch('insert:after', {
      item,
      index: finalIndex,
      meta: this.hookMeta,
    });

    return true;
  }

  /** Clears all items. Returns `false` if already empty or a hook cancelled. */
  protected _clear() {
    if (this.numItems === 0) {
      return false;
    }

    if (
      !this[$CollectionHookDispatcherSymbol].dispatch('clear:before', {
        meta: this.hookMeta,
      })
    ) {
      return false;
    }

    this.currentItems.splice(0, this.numItems);
    this.itemsByMap.clear();

    this[$CollectionHookDispatcherSymbol].dispatch('clear:after', {
      meta: this.hookMeta,
    });

    return true;
  }

  /** Dispatches the `update` event to `onUpdate` and registered listeners. */
  protected _dispatchUpdate() {
    this._updateItemsSnapshot();

    const updateEvent = new CollectionUpdateEvent<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >(this.itemsSnapshot);

    this.onUpdate?.(updateEvent);

    if (!updateEvent.immediatePropagationStopped) {
      this.dispatchEvent(updateEvent);
    }
  }

  /** Inserts `item` relative to the item identified by `key`. */
  protected _insertItem(
    key: PrimaryKeyType,
    item: CollectionItem<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >,
    isAfter: boolean,
  ) {
    if (!this._validateItem(item)) {
      return false;
    }

    const targetItem = this.getItem(key);
    const targetItemIndex =
      targetItem === null
        ? this.numItems
        : this.currentItems.indexOf(targetItem) + Number(isAfter);

    return this._appendItem(item, targetItemIndex);
  }

  /** Partially updates the item identified by `key`. */
  protected _patchItem(
    key: PrimaryKeyType,
    patchData: Partial<
      Omit<ItemData, CollectionPrimaryKeyWithDefault<PrimaryKey>>
    >,
  ) {
    const targetItem = this.getItem(key);

    if (targetItem === null) {
      return false;
    }

    const targetItemIndex = this.currentItems.indexOf(targetItem);

    if (
      !this[$CollectionHookDispatcherSymbol].dispatch('patch:before', {
        item: targetItem,
        index: targetItemIndex,
        meta: this.hookMeta,
      })
    ) {
      return false;
    }

    Object.assign(targetItem, patchData, {
      [this.primaryKey]: key,
    });

    if (this.primaryKey in patchData) {
      console.error(
        `CollectionError: primary key "${this.primaryKey}" must not be modified via patch. Key updates are not allowed.`,
      );
    }

    this[$CollectionHookDispatcherSymbol].dispatch('patch:after', {
      item: targetItem,
      index: targetItemIndex,
      meta: this.hookMeta,
    });

    return true;
  }

  /** Removes the item identified by `key`. Dispatches `remove:*` hooks. */
  protected _removeItem(key: PrimaryKeyType | unknown) {
    const targetItem = this.getItem(key);

    if (targetItem === null) {
      return false;
    }

    const targetItemIndex = this.currentItems.indexOf(targetItem);

    if (
      !this[$CollectionHookDispatcherSymbol].dispatch('remove:before', {
        item: targetItem,
        index: targetItemIndex,
        meta: this.hookMeta,
      })
    ) {
      return false;
    }

    this.currentItems.splice(targetItemIndex, 1);
    this.itemsByMap.delete(key);

    this[$CollectionHookDispatcherSymbol].dispatch('remove:after', {
      item: targetItem,
      index: targetItemIndex,
      meta: this.hookMeta,
    });

    return true;
  }

  /**
   * Replaces the item identified by `key` with `item` at the same position.
   * The old item is removed *silently* (no `remove:*` hooks).
   */
  protected _replaceItem(
    key: PrimaryKeyType,
    item: CollectionItem<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >,
  ) {
    if (!this._validateItem(item)) {
      return false;
    }

    const targetItem = this.getItem(key);
    const targetItemIndex =
      targetItem === null
        ? this.numItems
        : this.currentItems.indexOf(targetItem);

    // Silently evict the target item (no remove hooks).
    if (targetItem !== null) {
      this.currentItems.splice(targetItemIndex, 1);
      this.itemsByMap.delete(key);
    }

    return this._appendItem(item, targetItemIndex);
  }

  /** Resets the collection to `initialItems`. */
  protected _reset() {
    return this._setItems(this.initialItems);
  }

  /**
   * Replaces all items.
   *
   * @returns The number of successfully inserted items (may be `0` when
   * `items` is empty), or `null` if a `clear:before` hook cancelled the
   * operation.
   */
  protected _setItems(
    items: ReadonlyArray<
      CollectionItem<
        CollectionPrimaryKeyWithDefault<PrimaryKey>,
        PrimaryKeyType,
        ItemData
      >
    >,
  ): number | null {
    if (this.numItems !== 0 && !this._clear()) {
      return null;
    }

    let insertedCount = 0;

    for (const item of items) {
      if (this._appendItem(item)) {
        insertedCount++;
      }
    }

    return insertedCount;
  }

  /**
   * Replaces {@link itemsSnapshot} with a fresh frozen copy of
   * {@link currentItems}. Called once per successful mutation from
   * {@link _dispatchUpdate} (and once from the constructor after the
   * initial `_setItems`).
   */
  protected _updateItemsSnapshot() {
    this.itemsSnapshot = Object.freeze(this.currentItems.slice());
  }

  /** Validates that `item` carries the primary-key field. */
  private _validateItem(
    item: CollectionItem<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >,
  ) {
    if (!Object.hasOwnProperty.call(item, this.primaryKey)) {
      console.error(
        `CollectionError: missing required primary key "${this.primaryKey}" in item.`,
      );
      return false;
    }

    return true;
  }
}

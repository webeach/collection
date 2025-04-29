import { __DEVELOPMENT__ } from "../../constants/common";
import { CollectionUpdateEvent } from "../CollectionUpdateEvent";
import { HookDispatcher } from "../HookDispatcher";

import { $CollectionHookDispatcherSymbol } from "./constants";
import {
  CollectionBaseItemData,
  CollectionBaseKeyType,
  CollectionHookOperationType,
  CollectionHookParamsMap,
  CollectionHookParamsMeta,
  CollectionItem,
  CollectionOptions,
  CollectionPrimaryKeyWithDefault,
  CollectionUpdateEventHandler,
} from "./types";

/**
 * A strongly-typed collection class with event support and hook dispatching.
 *
 * @template PrimaryKey - Name of the primary key field.
 * @template PrimaryKeyType - Type of the primary key.
 * @template ItemData - Shape of the item data.
 */
export class Collection<
  PrimaryKey extends string = "key",
  PrimaryKeyType extends CollectionBaseKeyType = CollectionBaseKeyType,
  ItemData extends
    CollectionBaseItemData<PrimaryKey> = CollectionBaseItemData<PrimaryKey>,
> extends EventTarget {
  /**
   * A handler that is called whenever the collection is updated.
   *
   * This function is triggered after successful operations like adding, removing, patching, or resetting items.
   * To unsubscribe, set this property to `null`.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/properties/onUpdate.md
   */
  public onUpdate: CollectionUpdateEventHandler<
    CollectionPrimaryKeyWithDefault<PrimaryKey>,
    PrimaryKeyType,
    ItemData
  > | null = null;

  /**
   * The internal hook dispatcher for managing lifecycle hooks within the collection.
   *
   * It allows registering custom logic for operations like insert, remove, patch, and clear.
   * Useful for intercepting or extending collection behavior.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/hooks/clear.md
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/hooks/insert.md
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/hooks/patch.md
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/hooks/remove.md
   */
  public [$CollectionHookDispatcherSymbol] = new HookDispatcher<
    CollectionHookOperationType,
    CollectionHookParamsMap<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >
  >();

  /** Initial items of the collection (copied from options). */
  protected readonly initialItems: CollectionItem<
    CollectionPrimaryKeyWithDefault<PrimaryKey>,
    PrimaryKeyType,
    ItemData
  >[];

  /** Current list of items. */
  protected readonly items: CollectionItem<
    CollectionPrimaryKeyWithDefault<PrimaryKey>,
    PrimaryKeyType,
    ItemData
  >[] = [];

  /** Map for fast item lookup by primary key. */
  protected readonly itemsByMap = new Map<
    CollectionBaseKeyType,
    CollectionItem<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >
  >();

  /** Field name used as the primary key. */
  protected readonly primaryKey: PrimaryKey extends never ? "key" : PrimaryKey;

  /** Meta information passed to hooks. */
  private readonly hookMeta: CollectionHookParamsMeta<
    CollectionPrimaryKeyWithDefault<PrimaryKey>
  >;

  /**
   * Creates a new instance of the `Collection`.
   *
   * Initializes the collection with optional initial items and a custom primary key.
   * If no primary key is provided, the default `'key'` field is used.
   * The collection is populated using the provided `initialItems`, and hooks metadata is prepared.
   *
   * @param options - Configuration options for initializing the collection:
   * - `initialItems` — An array of initial items to populate the collection (optional).
   * - `primaryKey` — The name of the field to be used as the primary key (optional, defaults to `'key'`).
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
      primaryKey ?? ("key" as CollectionPrimaryKeyWithDefault<PrimaryKey>);

    this.hookMeta = Object.freeze({
      primaryKey: this.primaryKey,
    });

    this._setItems(this.initialItems);
  }

  /**
   * Adds a new item to the end of the collection.
   *
   * If an item with the same primary key already exists, it will be replaced.
   * After a successful insertion, an `update` event is triggered.
   *
   * @param item - The item to add to the collection.
   * @returns `true` if the item was successfully added; otherwise `false`.
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
   * Adds a new item to the collection at the specified index.
   *
   * If an item with the same primary key already exists, it will be replaced.
   * After a successful insertion, an `update` event is triggered.
   *
   * @param item - The item to add to the collection.
   * @param index - The position in the collection where the item should be inserted.
   * @returns `true` if the item was successfully added; otherwise `false`.
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
   * Completely clears the collection, removing all items and resetting internal indexes.
   *
   * If the collection is already empty, or if the clearing is canceled via a hook, no changes are made.
   * After a successful clearing, an `update` event is triggered.
   *
   * @returns `true` if the collection was successfully cleared; otherwise `false`.
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
   * Iterates over all items in the collection and executes the provided callback for each item.
   *
   * Iteration is performed on a copy of the current items to ensure that changes to the collection
   * during iteration do not affect the ongoing process.
   *
   * @param callback - A function that will be called for each item:
   * - `item` — the current item (read-only).
   * - `index` — the index of the current item.
   * - `currentItems` — a read-only array containing a copy of all items at the start of iteration.
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
      currentItems: Readonly<
        CollectionItem<
          CollectionPrimaryKeyWithDefault<PrimaryKey>,
          PrimaryKeyType,
          ItemData
        >
      >[],
    ) => void,
  ) {
    this.items.slice().forEach(callback);
  }

  /**
   * Retrieves an item from the collection by its primary key.
   *
   * @param key - The primary key of the item to retrieve.
   * @returns The item if found; otherwise `null`.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/methods/getItem.md
   */
  public getItem(key: PrimaryKeyType) {
    return this.itemsByMap.get(key) || null;
  }

  /**
   * Checks whether an item with the specified primary key exists in the collection.
   *
   * @param key - The primary key of the item to check.
   * @returns `true` if the item exists; otherwise `false`.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/methods/hasItem.md
   */
  public hasItem(key: PrimaryKeyType) {
    return this.itemsByMap.has(key);
  }

  /**
   * Inserts a new item into the collection immediately after the item with the specified primary key.
   *
   * If the target item is not found, the new item is appended to the end of the collection.
   * After a successful insertion, an `update` event is triggered.
   *
   * @param key - The primary key of the item after which the new item should be inserted.
   * @param item - The item to insert into the collection.
   * @returns `true` if the item was successfully inserted; otherwise `false`.
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
   * Inserts a new item into the collection immediately before the item with the specified primary key.
   *
   * If the target item is not found, the new item is appended to the end of the collection.
   * After a successful insertion, an `update` event is triggered.
   *
   * @param key - The primary key of the item before which the new item should be inserted.
   * @param item - The item to insert into the collection.
   * @returns `true` if the item was successfully inserted; otherwise `false`.
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
   * Partially updates an existing item in the collection by its primary key.
   *
   * Only the provided fields in the `patchData` will be updated; other fields remain unchanged.
   * The primary key of the item is forcibly preserved and cannot be modified.
   * After a successful patch, an `update` event is triggered.
   *
   * @param key - The primary key of the item to update.
   * @param patchData - A partial object containing the fields to update.
   * @returns `true` if the item was successfully updated; otherwise `false`.
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
   * Adds a new item to the beginning of the collection.
   *
   * If an item with the same primary key already exists, it will be replaced.
   * After a successful insertion, an `update` event is triggered.
   *
   * @param item - The item to add to the collection.
   * @returns `true` if the item was successfully added; otherwise `false`.
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
   * Removes an item from the collection by its primary key.
   *
   * If the item is found and successfully removed, an `update` event is triggered.
   *
   * @param key - The primary key of the item to remove.
   * @returns `true` if the item was successfully removed; otherwise `false`.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/methods/removeItem.md
   */
  public removeItem(key: PrimaryKeyType) {
    if (!this._removeItem(key)) {
      return false;
    }

    this._dispatchUpdate();

    return true;
  }

  /**
   * Replaces an existing item in the collection with a new item by its primary key.
   *
   * If the target item is not found, the new item is appended to the end of the collection.
   * After a successful replacement or addition, an `update` event is triggered.
   *
   * @param key - The primary key of the item to replace.
   * @param item - The new item to insert into the collection.
   * @returns `true` if the operation was successful; otherwise `false`.
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
   * Resets the collection to its initial state based on the original `initialItems`.
   *
   * If the collection had modifications, it will be cleared and repopulated with the initial items.
   * After a successful reset, an `update` event is triggered.
   *
   * @returns `true` if the collection was successfully reset; otherwise `false`.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/methods/reset.md
   */
  public reset() {
    if (!this._reset()) {
      return false;
    }

    this._dispatchUpdate();

    return true;
  }

  /**
   * Completely replaces the contents of the collection with the provided items.
   *
   * The collection will be cleared before inserting the new items.
   * After a successful replacement, an `update` event is triggered.
   *
   * @param items - An array of new items to set in the collection.
   * @returns `true` if the items were successfully set; otherwise `false`.
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
    if (!this._setItems(items)) {
      return false;
    }

    this._dispatchUpdate();

    return true;
  }

  /**
   * Returns the current number of items in the collection.
   *
   * This is a read-only property that always reflects the latest state of the collection.
   *
   * @returns The number of items in the collection.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/properties/numItems.md
   */
  public get numItems() {
    return this.items.length;
  }

  /**
   * Returns an iterator over the items in the collection.
   *
   * Iteration is performed on a copy of the items to ensure that changes to the collection
   * during iteration do not affect the ongoing iteration.
   *
   * @returns An iterator over the collection items.
   *
   * @see https://github.com/webeach/collection/blob/main/docs/en/Collection/methods/[Symbol.iterator].md
   */
  public [Symbol.iterator]() {
    return this.items.slice()[Symbol.iterator]();
  }

  /** Internally appends an item at a given index. Handles hooks and validation. */
  protected _appendItem(
    item: CollectionItem<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >,
    index = this.numItems,
  ) {
    const normalizedIndex = Math.min(Math.max(index, 0), this.numItems);

    if (
      !this._validateItem(item) ||
      !this[$CollectionHookDispatcherSymbol].dispatch("insert:before", {
        item,
        index,
        meta: this.hookMeta,
      })
    ) {
      return false;
    }

    const key = item[this.primaryKey];

    if (this.hasItem(key)) {
      this._removeItem(key);
    }

    this.items.splice(normalizedIndex, 0, item);
    this.itemsByMap.set(key, item);

    this[$CollectionHookDispatcherSymbol].dispatch("insert:after", {
      item,
      index,
      meta: this.hookMeta,
    });

    return true;
  }

  /** Internally clears all items. Handles hooks. */
  protected _clear() {
    if (this.numItems === 0) {
      return false;
    }

    if (
      !this[$CollectionHookDispatcherSymbol].dispatch("clear:before", {
        meta: this.hookMeta,
      })
    ) {
      return false;
    }

    this.items.splice(0, this.numItems);
    this.itemsByMap.clear();

    this[$CollectionHookDispatcherSymbol].dispatch("clear:after", {
      meta: this.hookMeta,
    });

    return true;
  }

  /** Dispatches an update event to listeners and subscribers. */
  protected _dispatchUpdate() {
    const updateEvent = new CollectionUpdateEvent<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >(this.items.slice());

    this.onUpdate?.(updateEvent);

    if (!updateEvent.immediatePropagationStopped) {
      this.dispatchEvent(updateEvent);
    }
  }

  /** Internally inserts an item relative to another item. */
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
        : this.items.indexOf(targetItem) + Number(isAfter);

    return this._appendItem(item, targetItemIndex);
  }

  /** Internally patches an existing item and fires hooks. */
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

    const targetItemIndex = this.items.indexOf(targetItem);

    if (
      !this[$CollectionHookDispatcherSymbol].dispatch("patch:before", {
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

    if (__DEVELOPMENT__ && this.primaryKey in patchData) {
      console.error(
        `CollectionError: primary key "${this.primaryKey}" must not be modified via patch. Key updates are not allowed.`,
      );
    }

    this[$CollectionHookDispatcherSymbol].dispatch("patch:after", {
      item: targetItem,
      index: targetItemIndex,
      meta: this.hookMeta,
    });

    return true;
  }

  /** Internally removes an item by its key and fires hooks. */
  protected _removeItem(key: PrimaryKeyType) {
    const targetItem = this.getItem(key);

    if (targetItem === null) {
      return false;
    }

    const targetItemIndex = this.items.indexOf(targetItem);

    if (
      !this[$CollectionHookDispatcherSymbol].dispatch("remove:before", {
        item: targetItem,
        index: targetItemIndex,
        meta: this.hookMeta,
      })
    ) {
      return false;
    }

    this.items.splice(targetItemIndex, 1);
    this.itemsByMap.delete(key);

    this[$CollectionHookDispatcherSymbol].dispatch("remove:after", {
      item: targetItem,
      index: targetItemIndex,
      meta: this.hookMeta,
    });

    return true;
  }

  /** Internally replaces an item or inserts a new one if missing. */
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
      targetItem === null ? this.numItems : this.items.indexOf(targetItem);

    if (targetItem !== null) {
      this._removeItem(key);
    }

    return this._appendItem(item, targetItemIndex);
  }

  /** Internally resets collection to its initial state. */
  protected _reset() {
    return this._setItems(this.initialItems);
  }

  /** Internally sets a new array of items. */
  protected _setItems(
    items: CollectionItem<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >[],
  ) {
    if (this.numItems !== 0 && !this._clear()) {
      return false;
    }

    if (items.length === 0) {
      return true;
    }

    const trueOnce = items.filter((item) => {
      return this._appendItem(item);
    });

    return trueOnce.length !== 0;
  }

  /** Validates that an item has a proper primary key and key type. */
  private _validateItem(
    item: CollectionItem<
      CollectionPrimaryKeyWithDefault<PrimaryKey>,
      PrimaryKeyType,
      ItemData
    >,
  ) {
    if (!Object.hasOwnProperty.call(item, this.primaryKey)) {
      if (__DEVELOPMENT__) {
        console.error(
          `CollectionError: missing required primary key "${this.primaryKey}" in item.`,
        );
      }
      return false;
    }

    const key = item[this.primaryKey];

    if (
      typeof key !== "string" &&
      typeof key !== "bigint" &&
      (typeof key !== "number" || !Number.isFinite(key))
    ) {
      if (__DEVELOPMENT__) {
        console.error(
          `CollectionError: primary key "${this.primaryKey}" must be a string, finite number, or bigint.`,
        );
      }
      return false;
    }

    return true;
  }
}

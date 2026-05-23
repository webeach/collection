import { BaseObject } from '../../types/common';
import { CollectionDefaultKeyType, CollectionItem } from '../Collection';

/**
 * Custom event dispatched by `Collection` after every successful mutation.
 *
 * The event's `detail` is a snapshot (shallow copy) of the collection's items
 * at the moment of dispatch.
 *
 * @typeParam PrimaryKey - The name of the primary key field.
 * @typeParam PrimaryKeyType - The type of the primary key value.
 * @typeParam ItemData - The shape of the item data.
 */
export class CollectionUpdateEvent<
  PrimaryKey extends string = 'key',
  PrimaryKeyType = CollectionDefaultKeyType,
  ItemData extends BaseObject = BaseObject,
> extends CustomEvent<
  ReadonlyArray<CollectionItem<PrimaryKey, PrimaryKeyType, ItemData>>
> {
  /**
   * Set to `true` after {@link stopImmediatePropagation} is called.
   *
   * `Collection` reads this flag to decide whether to call
   * `dispatchEvent(event)` after the `onUpdate` callback. In other words,
   * calling `event.stopImmediatePropagation()` inside `onUpdate` suppresses
   * the subsequent `addEventListener('update', ...)` dispatch entirely — a
   * behaviour intentionally broader than the standard `CustomEvent` semantics.
   */
  public immediatePropagationStopped = false;

  /**
   * @param items - A readonly array of collection items to attach as `event.detail`.
   */
  constructor(
    items: ReadonlyArray<CollectionItem<PrimaryKey, PrimaryKeyType, ItemData>>,
  ) {
    super('update', { detail: items });
  }

  /**
   * Stops immediate propagation and sets {@link immediatePropagationStopped}
   * to `true`.
   *
   * @remarks
   * In addition to the standard behaviour (stopping other listeners on the
   * same event), `Collection` will skip calling `dispatchEvent` for this
   * event after the `onUpdate` callback if this method was invoked there.
   */
  public override stopImmediatePropagation() {
    this.immediatePropagationStopped = true;
    super.stopImmediatePropagation();
  }
}

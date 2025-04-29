import { BaseObject } from "../../types/common";
import { CollectionBaseKeyType, CollectionItem } from "../Collection";

/**
 * Custom event for notifying about updates in a collection.
 *
 * @typeParam PrimaryKey - The name of the primary key field (default is `'key'`).
 * @typeParam PrimaryKeyType - The type of the primary key value (default is `CollectionBaseKeyType`).
 * @typeParam ItemData - The shape of the item data (default is `BaseObject`).
 */
export class CollectionUpdateEvent<
  PrimaryKey extends string = "key",
  PrimaryKeyType extends CollectionBaseKeyType = CollectionBaseKeyType,
  ItemData extends BaseObject = BaseObject,
> extends CustomEvent<
  ReadonlyArray<CollectionItem<PrimaryKey, PrimaryKeyType, ItemData>>
> {
  /**
   * Indicates whether immediate propagation of the event was stopped.
   */
  public immediatePropagationStopped = false;

  /**
   * Creates a new `CollectionUpdateEvent` with the provided collection items.
   *
   * @param items - A readonly array of collection items to attach as event detail.
   */
  constructor(
    items: ReadonlyArray<CollectionItem<PrimaryKey, PrimaryKeyType, ItemData>>,
  ) {
    super("update", { detail: items });
  }

  /**
   * Stops the immediate propagation of the event and sets the `immediatePropagationStopped` flag to `true`.
   * Overrides the default `stopImmediatePropagation` method of `CustomEvent`.
   */
  public override stopImmediatePropagation() {
    this.immediatePropagationStopped = true;
    super.stopImmediatePropagation();
  }
}

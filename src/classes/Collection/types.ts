import { BaseObject } from '../../types/common';
import { CollectionUpdateEvent } from '../CollectionUpdateEvent';

/**
 * Represents the minimal structure of an item in the collection,
 * containing a primary key and any additional fields.
 *
 * @typeParam PrimaryKey - The field name used as the primary key (defaults to `'key'`).
 */
export type CollectionBaseItemData<PrimaryKey extends string = 'key'> = {
  [K in PrimaryKey]: CollectionBaseKeyType;
} & BaseObject;

/**
 * Defines the allowed types for a primary key.
 */
export type CollectionBaseKeyType = string | number | bigint;

/**
 * Parameters passed to collection hooks for item-based operations
 * like `insert`, `patch`, and `remove`.
 *
 * @typeParam PrimaryKey - The primary key field name.
 * @typeParam PrimaryKeyType - The type of the primary key value.
 * @typeParam ItemData - The shape of the item data.
 */
export type CollectionHookParams<
  PrimaryKey extends string = 'key',
  PrimaryKeyType extends CollectionBaseKeyType = CollectionBaseKeyType,
  ItemData extends BaseObject = BaseObject,
> = [
  options: {
    index: number;
    item: CollectionItem<PrimaryKey, PrimaryKeyType, ItemData>;
    meta: CollectionHookParamsMeta<PrimaryKey>;
  },
];

/**
 * Parameters passed to collection hooks for the `clear` operation.
 *
 * @typeParam PrimaryKey - The primary key field name.
 */
export type CollectionHookParamsOperationClear<
  PrimaryKey extends string = 'key',
> = [
  {
    meta: CollectionHookParamsMeta<PrimaryKey>;
  },
];

/**
 * A map that defines the parameters for each collection hook operation.
 *
 * For `clear`, uses `CollectionHookParamsOperationClear`.
 * For others (`insert`, `patch`, `remove`), uses `CollectionHookParams`.
 *
 * @typeParam PrimaryKey - The primary key field name.
 * @typeParam PrimaryKeyType - The type of the primary key value.
 * @typeParam ItemData - The shape of the item data.
 */
export type CollectionHookParamsMap<
  PrimaryKey extends string = 'key',
  PrimaryKeyType extends CollectionBaseKeyType = CollectionBaseKeyType,
  ItemData extends BaseObject = BaseObject,
> = {
  [OperationKey in CollectionHookOperationType]: OperationKey extends `clear:${CollectionHookOperationStage}`
    ? CollectionHookParamsOperationClear<PrimaryKey>
    : CollectionHookParams<PrimaryKey, PrimaryKeyType, ItemData>;
};

/**
 * Metadata provided alongside every collection hook event.
 *
 * @typeParam PrimaryKey - The primary key field name.
 */
export type CollectionHookParamsMeta<PrimaryKey extends string = 'key'> = {
  readonly primaryKey: PrimaryKey;
};

/**
 * Defines all possible collection operation actions.
 */
export type CollectionHookOperationAction =
  | 'clear'
  | 'insert'
  | 'patch'
  | 'remove';

/**
 * Defines the possible stages of a collection operation.
 */
export type CollectionHookOperationStage = 'after' | 'before';

/**
 * Represents the full operation type as a combination of action and stage.
 * For example: `'insert:before'`, `'patch:after'`.
 */
export type CollectionHookOperationType =
  `${CollectionHookOperationAction}:${CollectionHookOperationStage}`;

/**
 * Represents a normalized item in the collection, ensuring the primary key exists and is readonly.
 *
 * @typeParam PrimaryKey - The field name used as the primary key.
 * @typeParam PrimaryKeyType - The type of the primary key value.
 * @typeParam ItemData - The shape of the item data excluding the primary key.
 */
export type CollectionItem<
  PrimaryKey extends string = 'key',
  PrimaryKeyType extends CollectionBaseKeyType = CollectionBaseKeyType,
  ItemData extends BaseObject = BaseObject,
> = Omit<ItemData, PrimaryKey> & {
  readonly [K in PrimaryKey]: PrimaryKeyType;
};

/**
 * Options for creating a new collection.
 *
 * @typeParam PrimaryKey - The field name used as the primary key.
 * @typeParam PrimaryKeyType - The type of the primary key value.
 * @typeParam ItemData - The shape of the item data.
 */
export type CollectionOptions<
  PrimaryKey extends string = 'key',
  PrimaryKeyType extends CollectionBaseKeyType = CollectionBaseKeyType,
  ItemData extends
    CollectionBaseItemData<PrimaryKey> = CollectionBaseItemData<PrimaryKey>,
> = {
  /** Initial list of items in the collection. */
  initialItems?: ReadonlyArray<
    CollectionItem<PrimaryKey, PrimaryKeyType, ItemData>
  >;
  /** Optional override for the primary key field name. */
  primaryKey?: PrimaryKey;
};

/**
 * Helper type to default the primary key to `'key'` if no primary key is specified.
 *
 * @typeParam PrimaryKey - The field name to use as primary key, or `never`.
 */
export type CollectionPrimaryKeyWithDefault<PrimaryKey extends string> =
  PrimaryKey extends never ? 'key' : PrimaryKey;

/**
 * Event handler type for handling `CollectionUpdateEvent` events.
 *
 * @typeParam PrimaryKey - The primary key field name.
 * @typeParam PrimaryKeyType - The type of the primary key value.
 * @typeParam ItemData - The shape of the item data.
 */
export type CollectionUpdateEventHandler<
  PrimaryKey extends string = 'key',
  PrimaryKeyType extends CollectionBaseKeyType = CollectionBaseKeyType,
  ItemData extends
    CollectionBaseItemData<PrimaryKey> = CollectionBaseItemData<PrimaryKey>,
> = (
  event: CollectionUpdateEvent<PrimaryKey, PrimaryKeyType, ItemData>,
) => void;

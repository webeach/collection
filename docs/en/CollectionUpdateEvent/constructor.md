# `constructor`

## Description

The `CollectionUpdateEvent` constructor creates a new collection update event with type `'update'`.  
The event carries the current list of collection items after the change.

> 📚 **Important:** This is a specialized event used internally by collections. It lets you observe changes without manually tracking state.

---

## Syntax

```ts
const event = new CollectionUpdateEvent(items);
```

- **`items`** — a new array of collection items.
- **Returns** — an instance of `CollectionUpdateEvent`.

---

## Behavior

1. Creates a custom event with type `'update'`.
2. Stores the passed items array in the `detail` field **as-is** — no copy is made. The collection passes its frozen snapshot here, which is why `event.detail === collection.items` holds inside any listener.
3. Supports `stopImmediatePropagation()` to control event propagation. When called inside `onUpdate`, the collection also skips the subsequent `dispatchEvent` to ordinary `addEventListener('update', ...)` listeners.

---

## Typing

The constructor supports generics for narrowing the item shape:

```ts
CollectionUpdateEvent<PrimaryKey extends string, PrimaryKeyType extends string | number | bigint, ItemData extends object>
```

- **`PrimaryKey`** — name of the primary key field (defaults to `'key'`).
- **`PrimaryKeyType`** — type of the key value (`string`, `number`, or `bigint`).
- **`ItemData`** — shape of the item object.

### Typed example

```ts
const event = new CollectionUpdateEvent<
  'id',
  number,
  { id: number; name: string }
>([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Alice' },
]);

console.log(event.type); // "update"
console.log(event.detail);
// [
//   { id: 1, name: 'John Doe' },
//   { id: 2, name: 'Alice' },
// ]
```

# `insertItemAfter`

## Description

The `insertItemAfter` method inserts a new item into the collection immediately after the specified item by its primary key.  
If the target item is not found, the new item is appended to the end of the collection.  
After insertion, an `update` event will be triggered.

> ℹ️ **Details:**
> - If the target item exists, the new item is inserted directly after it.
> - If the target item is not found, the behavior is equivalent to `appendItem`.

---

## Syntax

```ts
collectionInstance.insertItemAfter(key, item): boolean;
```

- **`key`** — the primary key of the item after which the new item should be inserted.
- **`item`** — the item to insert.
- **Returns** — `true` if the item was successfully inserted, otherwise `false`.

---

## Behavior

1. The target item is searched by the provided key.
2. The `insert:before` hook is called.
3. If the target item is found:
  - The new item is inserted immediately after it.
4. If the target item is not found:
  - The new item is appended to the end of the collection (like `appendItem`).
5. The `insert:after` hook is called.
6. The `update` event is triggered.

---

## Examples

### Inserting an item after an existing one

```ts
const collection = new Collection({
  initialItems: [
    { key: 'user1', name: 'John Doe' },
    { key: 'user2', name: 'Alice' },
  ],
});

collection.insertItemAfter('user1', { key: 'user3', name: 'Bob' });

console.log(Array.from(collection));
// [
//   { key: 'user1', name: 'John Doe' },
//   { key: 'user3', name: 'Bob' },
//   { key: 'user2', name: 'Alice' }
// ]
```

---

### Inserting an item when the target item is not found

```ts
const collection = new Collection({
  initialItems: [
    { key: 'user1', name: 'John Doe' },
  ],
});

collection.insertItemAfter('nonexistent', { key: 'user2', name: 'Alice' });

console.log(Array.from(collection));
// [
//   { key: 'user1', name: 'John Doe' },
//   { key: 'user2', name: 'Alice' }
// ]
```

---

### Using a custom primary key

```ts
const collection = new Collection({
  primaryKey: 'id',
  initialItems: [
    { id: 1, name: 'John Doe' },
  ],
});

collection.insertItemAfter(1, { id: 2, name: 'Alice' });

console.log(Array.from(collection));
// [
//   { id: 1, name: 'John Doe' },
//   { id: 2, name: 'Alice' }
// ]
```

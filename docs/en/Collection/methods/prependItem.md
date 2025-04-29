# `prependItem`

## Description

The `prependItem` method adds a new item to the beginning of the collection.  
If an item with the same primary key already exists, it will be replaced with the new item.  
After a successful addition, an `update` event will be triggered.

---

## Syntax

```ts
collectionInstance.prependItem(item): boolean;
```

- **`item`** — the item to add to the collection.
- **Returns** — `true` if the item was successfully added, otherwise `false`.

---

## Behavior

1. The item is validated to ensure it has a correct primary key.
2. The `insert:before` hook is called.
3. If an item with the same key already exists, it is removed (triggering the `remove:*` hooks).
4. The new item is inserted at the beginning of the collection.
5. The `insert:after` hook is called.
6. The `update` event is triggered.

---

## Examples

### Adding a new item to the beginning

```ts
const collection = new Collection({
  initialItems: [
    { key: "user2", name: "Alice" },
    { key: "user3", name: "Bob" },
  ],
});

collection.prependItem({ key: "user1", name: "John Doe" });

console.log(Array.from(collection));
// [
//   { key: 'user1', name: 'John Doe' },
//   { key: 'user2', name: 'Alice' },
//   { key: 'user3', name: 'Bob' },
// ]
```

---

### Replacing an item with the same key

```ts
const collection = new Collection({
  initialItems: [
    { key: "user1", name: "Old John" },
    { key: "user2", name: "Alice" },
  ],
});

collection.prependItem({ key: "user1", name: "New John" });

console.log(Array.from(collection));
// [
//   { key: 'user1', name: 'New John' },
//   { key: 'user2', name: 'Alice' },
// ]
```

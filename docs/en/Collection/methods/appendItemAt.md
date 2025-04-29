# `appendItemAt`

## Description

The `appendItemAt` method adds a new item to the collection at the specified position (index).  
If an item with the same primary key already exists, it will be replaced with the new item.  
After a successful addition, an `update` event will be triggered.

---

## Syntax

```ts
collectionInstance.appendItemAt(item, index): boolean;
```

- **`item`** — the item to add.
- **`index`** — the position in the collection where the item will be inserted.
- **Returns** — `true` if the item was successfully added, otherwise `false`.

---

## Behavior

1. Validates the presence of a correct primary key.
2. Calls the `insert:before` hook.
3. If an item with the same key exists, it is replaced (the old item is removed and `remove:*` hooks are triggered).
4. The new item is inserted at the specified position (index is adjusted to be within valid bounds).
5. Calls the `insert:after` hook.
6. Triggers the `update` event.

---

## Examples

### Basic insertion at the beginning of the collection

```ts
const collection = new Collection();

collection.appendItem({ key: "user2", name: "Alice" });
collection.appendItemAt({ key: "user1", name: "John Doe" }, 0);

console.log(collection.numItems); // 2
console.log(Array.from(collection));
// [ { key: 'user1', name: 'John Doe' }, { key: 'user2', name: 'Alice' } ]
```

---

### Inserting an item into the middle of the collection

```ts
const collection = new Collection();

collection.appendItem({ key: "user1", name: "John Doe" });
collection.appendItem({ key: "user3", name: "Charlie" });
collection.appendItemAt({ key: "user2", name: "Alice" }, 1);

console.log(collection.numItems); // 3
console.log(Array.from(collection));
// [ { key: 'user1', name: 'John Doe' }, { key: 'user2', name: 'Alice' }, { key: 'user3', name: 'Charlie' } ]
```

---

### Replacing an existing item during insertion

```ts
const collection = new Collection({
  initialItems: [{ key: "user1", name: "Old User" }],
});

collection.appendItemAt({ key: "user1", name: "Updated User" }, 0);

console.log(collection.numItems); // 1
console.log(collection.getItem("user1"));
// { key: 'user1', name: 'Updated User' }
```

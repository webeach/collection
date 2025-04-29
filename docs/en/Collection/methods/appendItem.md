# `appendItem`

## Description

The `appendItem` method adds a new item to the end of the collection.
If an item with the same primary key already exists, it will be replaced with the new item.
After a successful addition, an `update` event will be triggered.

---

## Syntax

```ts
collectionInstance.appendItem(item): boolean;
```

- **`item`** — The item to add to the collection.
- **Returns** — `true` if the item was successfully added, otherwise `false`.

---

## Behavior

1. Verifies the presence of a valid primary key.
2. Triggers the `insert:before` hook.
3. If an item with the same key already exists, it is replaced with the new item (the old item is removed, triggering `remove:*` hooks).
4. Triggers the `insert:after` hook.
5. Triggers the `update` event.

---

## Examples

### Basic usage

```ts
const collection = new Collection();

collection.appendItem({ key: "user1", name: "John Doe" });

console.log(collection.numItems); // 1
console.log(collection.getItem("user1"));
// { key: 'user1', name: 'John Doe' }
```

---

### Replacing an existing item

```ts
const collection = new Collection({
  initialItems: [{ key: "user1", name: "John Doe" }],
});

collection.appendItem({ key: "user1", name: "Jane Smith" });

console.log(collection.numItems); // 1 (old item replaced)
console.log(collection.getItem("user1"));
// { key: 'user1', name: 'Jane Smith' }
```

---

### Adding multiple items

```ts
const collection = new Collection();

collection.appendItem({ key: "user2", name: "Alice" });
collection.appendItem({ key: "user3", name: "Bob" });

console.log(collection.numItems); // 2
console.log(collection.getItem("user2"));
// { key: 'user2', name: 'Alice' }
console.log(collection.getItem("user3"));
// { key: 'user3', name: 'Bob' }
```

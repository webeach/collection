# `setItems`

## Description

The `setItems` method completely replaces the contents of the collection with the newly provided items.  
After a successful replacement, an `update` event will be triggered.

---

## Syntax

```ts
collectionInstance.setItems(items[]): boolean;
```

- **`items`** — an array of new items for the collection.
- **Returns** — `true` if the items were successfully added; otherwise `false`.

---

## Behavior

1. If the collection is not empty, the `clear()` method is called along with the `clear:*` hooks.
2. For each new item, the `insert:before` and `insert:after` hooks are triggered.
3. After all items are added, the `update` event is triggered.

---

## Examples

### Replacing all items in the collection

```ts
const collection = new Collection({
  initialItems: [
    { key: "user1", name: "John Doe" },
    { key: "user2", name: "Alice" },
  ],
});

collection.setItems([
  { key: "user3", name: "Bob" },
  { key: "user4", name: "Charlie" },
]);

console.log(collection.numItems); // 2
console.log(Array.from(collection));
// [ { key: 'user3', name: 'Bob' }, { key: 'user4', name: 'Charlie' } ]
```

---

### Using a custom primary key

```ts
const collection = new Collection({
  primaryKey: "id",
  initialItems: [
    { id: "foo", title: "First" },
    { id: "bar", title: "Second" },
  ],
});

collection.setItems([
  { id: "baz", title: "Third" },
  { id: "qux", title: "Fourth" },
]);

console.log(collection.numItems); // 2
console.log(collection.getItem("baz"));
// { id: 'baz', title: 'Third' }
```

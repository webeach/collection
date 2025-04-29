# `reset`

## Description

The `reset` method resets the collection to its initial state, restoring the items from the `initialItems` array provided to the constructor.  
After a successful reset, an `update` event will be triggered.

---

## Syntax

```ts
collectionInstance.reset(): boolean;
```

- **Returns** — `true` if items were successfully restored after reset; otherwise `false`.

---

## Behavior

1. If the collection is not empty, the `clear()` method is called along with the `clear:*` hooks.
2. Items from `initialItems` are restored, triggering `insert:before` and `insert:after` hooks for each item.
3. The `update` event is triggered.

---

## Examples

### Resetting the collection to the initial state

```ts
const collection = new Collection({
  initialItems: [
    { key: "user1", name: "John Doe" },
    { key: "user2", name: "Alice" },
  ],
});

collection.appendItem({ key: "user3", name: "Bob" });

console.log(collection.numItems); // 3

collection.reset();

console.log(collection.numItems); // 2
console.log(Array.from(collection));
// [ { key: 'user1', name: 'John Doe' }, { key: 'user2', name: 'Alice' } ]
```

---

### Resetting a collection with a custom primary key

```ts
const collection = new Collection({
  primaryKey: "id",
  initialItems: [
    { id: "foo", title: "First" },
    { id: "bar", title: "Second" },
  ],
});

collection.appendItem({ id: "baz", title: "Third" });
collection.reset();

console.log(collection.numItems); // 2
console.log(collection.getItem("foo"));
// { id: 'foo', title: 'First' }
```

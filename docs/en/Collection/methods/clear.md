# `clear`

## Description

The `clear` method completely clears the collection, removing all items and resetting internal indexes.  
After clearing, an `update` event will be triggered.

> ⚠️ **Important:** `remove:*` hooks are **not triggered** for each removed item. Only `clear:before` and `clear:after` hooks are called to ensure maximum performance.

---

## Syntax

```ts
collectionInstance.clear(): boolean;
```

- **Returns** — `true` if the collection was successfully cleared, otherwise `false` (if the operation was canceled by a hook or the collection was already empty).

---

## Behavior

1. If the collection is already empty, the method returns `false` and does nothing.
2. Before removing all items, the `clear:before` hook is called.

- If the hook cancels the operation, clearing is aborted, and the method returns `false`.

3. All items and internal indexes are cleared.
4. After clearing, the `clear:after` hook is called.
5. The `update` event is triggered.
6. The method returns `true`.

---

## Examples

### Clearing a collection

```ts
const collection = new Collection({
  initialItems: [
    { key: "user1", name: "John Doe" },
    { key: "user2", name: "Alice" },
  ],
});

console.log(collection.numItems); // 2

const result = collection.clear();

console.log(result); // true
console.log(collection.numItems); // 0
console.log(Array.from(collection)); // []
```

---

### Reusing the collection after clearing

```ts
const collection = new Collection();

collection.appendItem({ key: "user1", name: "John Doe" });
collection.clear();
collection.appendItem({ key: "user2", name: "Alice" });

console.log(collection.numItems); // 1
console.log(collection.getItem("user2"));
// { key: 'user2', name: 'Alice' }
```

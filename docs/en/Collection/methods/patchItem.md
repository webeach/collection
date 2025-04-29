# `patchItem`

## Description

The `patchItem` method updates an existing item in the collection by its primary key.  
Only the provided fields in the `patchData` will be updated — other fields remain unchanged.  
After a successful update, an `update` event will be triggered.

> ⚠️ **Important:** when patching, a new primary key (if provided) will be ignored. The original key of the item will be preserved.

---

## Syntax

```ts
collectionInstance.patchItem(key, patchData): boolean;
```

- **`key`** — the primary key of the item to update.
- **`patchData`** — the partial data to apply.
- **Returns** — `true` if the item was successfully updated, otherwise `false`.

---

## Behavior

1. The item is searched by the provided primary key.
2. If the item is found:

- The `patch:before` hook is called.
- The existing item data is merged with the `patchData`.
- The primary key is forcibly preserved without changes.
- The `patch:after` hook is called.
- The `update` event is triggered.

3. If the item is not found, `false` is returned.

---

## Examples

### Partially updating an item

```ts
const collection = new Collection({
  initialItems: [{ key: "user1", name: "John Doe", age: 30 }],
});

collection.patchItem("user1", { age: 31 });

console.log(collection.getItem("user1"));
// { key: 'user1', name: 'John Doe', age: 31 }
```

---

### Attempting to change the primary key

```ts
const collection = new Collection({
  initialItems: [{ key: "user1", name: "John Doe" }],
});

collection.patchItem("user1", { key: "newKey" } as any);

console.log(collection.getItem("user1"));
// { key: 'user1', name: 'John Doe' }
```

---

### Using a custom primary key

```ts
const collection = new Collection({
  primaryKey: "id",
  initialItems: [{ id: 1, name: "Alice", age: 25 }],
});

collection.patchItem(1, { age: 26 });

console.log(collection.getItem(1));
// { id: 1, name: 'Alice', age: 26 }
```

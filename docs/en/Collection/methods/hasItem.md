# `hasItem`

## Description

The `hasItem` method checks whether an item exists in the collection by its primary key.  
It returns a boolean value: `true` if the item exists, and `false` otherwise.

> ℹ️ **Details:**
>
> - The check is performed using the internal `Map`, ensuring very fast (O(1)) verification.

---

## Syntax

```ts
collectionInstance.hasItem(key): boolean;
```

- **`key`** — the primary key value of the item to check.
- **Returns** — `true` if the item exists, otherwise `false`.

---

## Behavior

1. The presence of the key is checked in the collection's `Map`.
2. The result of the check is returned.

---

## Examples

### Checking for an existing item

```ts
const collection = new Collection({
  initialItems: [
    { key: "user1", name: "John Doe" },
    { key: "user2", name: "Alice" },
  ],
});

console.log(collection.hasItem("user1")); // true
```

---

### Checking for a missing item

```ts
const collection = new Collection({
  initialItems: [{ key: "user1", name: "John Doe" }],
});

console.log(collection.hasItem("nonexistent")); // false
```

---

### Using a collection with a custom primary key

```ts
const collection = new Collection({
  primaryKey: "id",
  initialItems: [
    { id: 101, name: "John Doe" },
    { id: 102, name: "Alice" },
  ],
});

console.log(collection.hasItem(101)); // true
console.log(collection.hasItem(999)); // false
```

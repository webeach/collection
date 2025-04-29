# `numItems`

## Description

The `numItems` property returns the current number of items in the collection.

This is a read-only property that always reflects the up-to-date state of the collection after any operations like adding, removing, clearing, or replacing items.

---

## Syntax

```ts
const count = collection.numItems;
```

- **count** — the number of items in the collection.

---

## Examples

### Getting the number of items

```ts
const collection = new Collection<"id", string, { id: string; label: string }>({
  primaryKey: "id",
});

console.log(collection.numItems); // 0

collection.appendItem({ id: "a", label: "First" });
collection.appendItem({ id: "b", label: "Second" });

console.log(collection.numItems); // 2
```

---

### After removing an item

```ts
collection.removeItem("a");

console.log(collection.numItems); // 1
```

---

### After clearing the collection

```ts
collection.clear();

console.log(collection.numItems); // 0
```

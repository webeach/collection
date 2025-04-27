# `forEach`

## Description

The `forEach` method allows you to iterate over all items in the collection and execute a provided function for each item.
Items are passed to the callback in the order they appear in the collection.

> ℹ️ **Details:**
> - Iteration is performed on a **copy** of the collection's items to avoid issues if the collection is modified inside the callback.
> - The original collection remains unchanged during the iteration.

---

## Syntax

```ts
collectionInstance.forEach((item, index, items) => { ... }): void;
```

- **`item`** — the current item.
- **`index`** — the index of the current item.
- **`items`** — a copy of all items at the start of the iteration.
- **Returns** — nothing (`void`).

---

## Behavior

1. A copy of all current items in the collection is created.
2. The provided callback is invoked for each item.
3. If the collection is modified during iteration, it does **not** affect the ongoing iteration.

---

## Examples

### Iterating over all collection items

```ts
const collection = new Collection({
  initialItems: [
    { key: 'user1', name: 'John Doe' },
    { key: 'user2', name: 'Alice' },
  ],
});

collection.forEach((item, index) => {
  console.log(index, item.name);
});

// Output:
// 0 'John Doe'
// 1 'Alice'
```

---

### Modifying the collection during iteration (without affecting the current iteration)

```ts
const collection = new Collection();

collection.appendItem({ key: 'user1', name: 'John Doe' });
collection.appendItem({ key: 'user2', name: 'Alice' });

collection.forEach((item) => {
  console.log(item.name);
  collection.clear(); // Clearing the collection inside the loop
});

// Output (only the items present at the start of the iteration):
// 'John Doe'
// 'Alice'
```

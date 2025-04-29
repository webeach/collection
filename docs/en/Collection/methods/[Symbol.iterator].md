# `[Symbol.iterator]`

## Description

The `[Symbol.iterator]` method makes the collection iterable using standard JavaScript mechanisms such as `for...of` and `Array.from`.

> 📚 **Important:** The iterator returns a **copy** of the current list of items at the time of invocation.  
> This protects against errors caused by modifying the collection during iteration.

---

## Syntax

```ts
for (const item of collectionInstance) {
  // process each item
}

// or

const array = Array.from(collectionInstance);
```

- **Returns** — an iterator over the collection's items.

---

## Behavior

1. A copy of all current items in the collection is created.
2. Iteration is performed over this copy.
3. Changes to the collection during iteration do **not** affect the ongoing iteration.

---

## Examples

### Iterating over the collection using `for...of`

```ts
const collection = new Collection({
  initialItems: [
    { key: "user1", name: "John Doe" },
    { key: "user2", name: "Alice" },
  ],
});

for (const item of collection) {
  console.log(item);
}
// { key: 'user1', name: 'John Doe' }
// { key: 'user2', name: 'Alice' }
```

---

### Converting the collection to an array

```ts
const collection = new Collection({
  initialItems: [
    { key: "user1", name: "John Doe" },
    { key: "user2", name: "Alice" },
  ],
});

const itemsArray = Array.from(collection);

console.log(itemsArray);
// [ { key: 'user1', name: 'John Doe' }, { key: 'user2', name: 'Alice' } ]
```

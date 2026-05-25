# `items`

## Description

The `items` property returns the current snapshot of the collection items as a frozen array.

The snapshot is rebuilt **once per successful mutation**, right before the `update` event is dispatched. Between mutations the reference is stable, which makes `O(1)` change detection via reference comparison possible.

> 📚 **Important:** The returned array is frozen via `Object.freeze`. Any attempt to mutate it externally will throw in strict mode or be silently ignored otherwise.

---

## Syntax

```ts
const snapshot = collection.items;
```

- **Returns** — `ReadonlyArray<CollectionItem>` — a frozen array of items as of the last mutation.

---

## Behavior

1. After every successful mutation (`appendItem`, `removeItem`, `clear`, etc.) a brand-new frozen snapshot array is created.
2. Until the next mutation, repeated reads of `collection.items` return the very same reference.
3. Inside an `update` event listener the following holds:
   ```ts
   event.detail === collection.items; // true
   ```
4. Active iterations (`forEach`, `for...of`) walk the snapshot that existed when the iteration started — subsequent mutations do not affect them.

---

## Examples

### Basic reading

```ts
const collection = new Collection({
  initialItems: [
    { key: 'user1', name: 'John Doe' },
    { key: 'user2', name: 'Alice' },
  ],
});

console.log(collection.items);
// [
//   { key: 'user1', name: 'John Doe' },
//   { key: 'user2', name: 'Alice' },
// ]
```

---

### Cheap change detection via reference equality

```ts
const before = collection.items;

collection.appendItem({ key: 'user3', name: 'Bob' });

const after = collection.items;

console.log(before === after); // false — the collection changed
```

```ts
const a = collection.items;
const b = collection.items;

console.log(a === b); // true — reference is stable between mutations
```

---

### Shared reference with `event.detail`

```ts
collection.onUpdate = (event) => {
  console.log(event.detail === collection.items); // true
};

collection.appendItem({ key: 'user4', name: 'Charlie' });
```

---

### Mutation attempts are blocked

```ts
const snapshot = collection.items;

snapshot.push({ key: 'user5', name: 'Eve' });
// TypeError: Cannot add property … object is not extensible (in strict mode)
```

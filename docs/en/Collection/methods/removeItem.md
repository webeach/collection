# `removeItem`

## Description

The `removeItem` method removes an item from the collection by its primary key.  
If the item is found and successfully removed, an `update` event will be triggered.

---

## Syntax

```ts
collectionInstance.removeItem(key): boolean;
```

- **`key`** — the primary key of the item to remove.
- **Returns** — `true` if the item was found and removed, otherwise `false`.

---

## Behavior

1. The item is searched by the provided primary key.
2. If the item is found:
  - The `remove:before` hook is called.
  - The item is removed from the collection and the internal index.
  - The `remove:after` hook is called.
  - The `update` event is triggered.
3. If the item is not found, the method returns `false` without calling any hooks or events.

---

## Examples

### Removing an existing item

```ts
const collection = new Collection({
  initialItems: [
    { key: 'user1', name: 'John Doe' },
    { key: 'user2', name: 'Alice' },
  ],
});

const removed = collection.removeItem('user1');

console.log(removed); // true
console.log(Array.from(collection));
// [ { key: 'user2', name: 'Alice' } ]
```

---

### Attempting to remove a non-existing item

```ts
const collection = new Collection({
  initialItems: [
    { key: 'user1', name: 'John Doe' },
  ],
});

const removed = collection.removeItem('user2');

console.log(removed); // false
console.log(Array.from(collection));
// [ { key: 'user1', name: 'John Doe' } ]
```

---

### Using a custom primary key

```ts
const collection = new Collection({
  primaryKey: 'id',
  initialItems: [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ],
});

const removed = collection.removeItem(1);

console.log(removed); // true
console.log(Array.from(collection));
// [ { id: 2, name: 'Bob' } ]
```

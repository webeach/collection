# `getItem`

## Description

The `getItem` method allows you to retrieve an item from the collection by its primary key.  
If an item with the specified key exists, its object is returned. If the item does not exist, `null` is returned.

> ℹ️ **Details:**
> - Item lookup is performed via the internal `Map`, ensuring fast (O(1)) access speed.

---

## Syntax

```ts
collectionInstance.getItem(key): Item | null;
```

- **`key`** — the primary key value of the item to find.
- **Returns** — the item object if found, otherwise `null`.

---

## Behavior

1. The collection's internal `Map` is searched using the provided key.
2. If the item is found, it is returned.
3. If the item is not found, `null` is returned.

---

## Examples

### Retrieving an item by key

```ts
const collection = new Collection({
  initialItems: [
    { key: 'user1', name: 'John Doe' },
    { key: 'user2', name: 'Alice' },
  ],
});

const user = collection.getItem('user1');

console.log(user);
// { key: 'user1', name: 'John Doe' }
```

---

### Handling a missing item

```ts
const collection = new Collection({
  initialItems: [
    { key: 'user1', name: 'John Doe' },
  ],
});

const user = collection.getItem('nonexistent');

console.log(user); // null
```

---

### Using a custom primary key

```ts
const collection = new Collection({
  primaryKey: 'id',
  initialItems: [
    { id: 101, name: 'John Doe' },
    { id: 102, name: 'Alice' },
  ],
});

const user = collection.getItem(101);

console.log(user);
// { id: 101, name: 'John Doe' }
```

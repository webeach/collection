# `replaceItem`

## Description

The `replaceItem` method replaces an existing item in the collection with a new item based on the specified primary key.  
If the item with the given key does not exist, the new item will be appended to the end of the collection.

---

## Syntax

```ts
collectionInstance.replaceItem(key, item): boolean;
```

- **`key`** — the primary key of the item to replace.
- **`item`** — the new item to insert.
- **Returns** — `true` if the operation was successful.

---

## Behavior

1. The validity of the new item is checked.
2. The existing item is searched by the provided key.
3. If the item is found:

- The `remove:before` hook is called.
- The old item is removed.
- The `remove:after` hook is called.

4. The `insert:before` hook is called.
5. The new item is inserted in place of the old one.
6. The `insert:after` hook is called.
7. The `update` event is triggered.

If no matching item is found, the new item will simply be appended to the end of the collection.

---

## Examples

### Replacing an existing item

```ts
const collection = new Collection({
  initialItems: [
    { key: "user1", name: "John Doe" },
    { key: "user2", name: "Alice" },
  ],
});

collection.replaceItem("user1", { key: "user1", name: "Jane Smith" });

console.log(collection.getItem("user1"));
// { key: 'user1', name: 'Jane Smith' }
```

---

### Adding a new item through replaceItem

```ts
const collection = new Collection();

collection.replaceItem("user3", { key: "user3", name: "Charlie" });

console.log(collection.getItem("user3"));
// { key: 'user3', name: 'Charlie' }
```

---

### Using a custom primary key

```ts
const collection = new Collection({
  primaryKey: "id",
  initialItems: [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ],
});

collection.replaceItem(1, { id: 1, name: "Alicia" });

console.log(collection.getItem(1));
// { id: 1, name: 'Alicia' }
```

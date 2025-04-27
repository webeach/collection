# `insert:*`

## Description

The `insert:before` and `insert:after` hooks are triggered when a new item is added to the collection.

- `insert:before` is called **before** inserting the item.
- `insert:after` is called **after** the item has been successfully inserted.

Hooks allow you to intercept the insertion process, modify the item, or cancel the operation.

---

## Hook Syntax

```ts
hook({
  item,
  index,
  meta,
}): boolean | void;
```

- **item** — the item being inserted.
- **index** — the index where the item is inserted.
- **meta** — metadata about the collection (e.g., primary key field name).
- **Return value**:
  - If `insert:before` returns `false`, the insertion is canceled.
  - `insert:after` does not affect the flow of the operation.

---

## Behavior

- `insert:before` can block insertion by returning `false`.
- `insert:after` is always called after a successful insertion.
- If multiple hooks are registered, they are called in the order they were registered.

---

## Examples

### Blocking insertion under certain conditions

```ts
collection[$CollectionHookDispatcherSymbol].register('insert:before', ({ item }) => {
  if (item.type === 'forbidden') {
    return false; // Block insertion of forbidden type
  }
});
```

---

### Modifying an item before insertion

```ts
collection[$CollectionHookDispatcherSymbol].register('insert:before', ({ item }) => {
  item.createdAt = new Date();
});
```

---

### Reacting to a successful insertion

```ts
collection[$CollectionHookDispatcherSymbol].register('insert:after', ({ item, index, meta }) => {
  console.log(`Item with key ${item[meta.primaryKey]} successfully inserted at position ${index}`);
});
```

# `remove:*`

## Description

The `remove:before` and `remove:after` hooks are triggered when an item is removed from the collection.

- `remove:before` is called **before** removing the item.
- `remove:after` is called **after** the item has been successfully removed.

Hooks allow you to intercept the removal process, validate conditions, or perform side actions.

---

## Hook Syntax

```ts
hook({
  item,
  index,
  meta,
}): boolean | void;
```

- **item** — the item that will be removed.
- **index** — the index of the item in the collection.
- **meta** — metadata about the collection (e.g., primary key field name).
- **Return value**:
  - If `remove:before` returns `false`, the removal is canceled.
  - `remove:after` does not affect the flow of the operation.

---

## Behavior

- `remove:before` can block the removal by returning `false`.
- `remove:after` is always called after a successful removal.
- Hooks are executed in the order they were registered.

---

## Examples

### Blocking removal under certain conditions

```ts
collection[$CollectionHookDispatcherSymbol].register('remove:before', ({ item }) => {
  if (item.protected) {
    return false; // Prevent removal of protected items
  }
});
```

---

### Logging successful removal

```ts
collection[$CollectionHookDispatcherSymbol].register('remove:after', ({ item, index, meta }) => {
  console.log(`Item with key ${item[meta.primaryKey]} was removed from position ${index}`);
});
```

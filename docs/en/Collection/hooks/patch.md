# `patch:*`

## Description

The `patch:before` and `patch:after` hooks are triggered when an existing item in the collection is updated.

- `patch:before` is called **before** applying changes to the item.
- `patch:after` is called **after** changes are successfully applied.

Hooks allow you to intercept the patching process, validate updates, or perform additional actions.

---

## Hook Syntax

```ts
hook({
  item,
  index,
  meta,
}): boolean | void;
```

- **item** — the item that will be updated.
- **index** — the index of the item in the collection.
- **meta** — metadata about the collection (e.g., primary key field name).
- **Return value**:
  - If `patch:before` returns `false`, the patch operation is canceled.
  - `patch:after` does not affect the operation flow.

---

## Behavior

- `patch:before` can block the patch operation by returning `false`.
- `patch:after` is always called after a successful patch.
- Hooks are called in the order they are registered.

---

## Examples

### Blocking updates under certain conditions

```ts
collection[$CollectionHookDispatcherSymbol].register('patch:before', ({ item }) => {
  if (item.readonly) {
    return false; // Prevent changes to protected items
  }
});
```

---

### Logging successful updates

```ts
collection[$CollectionHookDispatcherSymbol].register('patch:after', ({ item, index, meta }) => {
  console.log(`Item with key ${item[meta.primaryKey]} updated at position ${index}`);
});
```

---

### Mutating an item after patching

```ts
collection[$CollectionHookDispatcherSymbol].register('patch:after', ({ item }) => {
  item.updatedAt = new Date(); // Add updated timestamp
});
```

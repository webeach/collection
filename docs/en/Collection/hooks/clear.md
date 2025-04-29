# `clear:before` and `clear:after`

## Description

The `clear:before` and `clear:after` hooks are triggered during the collection clearing process.

- `clear:before` is called **before** removing all items.
- `clear:after` is called **after** the collection has been successfully cleared.

Hooks allow you to intercept and extend the clearing behavior.

---

## Hook Syntax

```ts
hook({
  meta,
}): boolean | void;
```

- **meta** — metadata about the collection (e.g., primary key field name).
- **Return value**:
  - If `clear:before` returns `false`, the clearing operation is canceled.
  - `clear:after` does not affect the flow of the operation.

---

## Behavior

- `clear:before` can block the clearing process by returning `false`.
- `clear:after` is always called after a successful clearing.
- Hooks are executed in the order they are registered.

---

## Examples

### Blocking collection clearing

```ts
collection[$CollectionHookDispatcherSymbol].register(
  "clear:before",
  ({ meta }) => {
    console.log(
      `Attempt to clear a collection with primary key ${meta.primaryKey}`,
    );
    return false; // Prevent clearing
  },
);
```

---

### Action after successful clearing

```ts
collection[$CollectionHookDispatcherSymbol].register(
  "clear:after",
  ({ meta }) => {
    console.log(
      `Collection with primary key ${meta.primaryKey} has been successfully cleared.`,
    );
  },
);
```

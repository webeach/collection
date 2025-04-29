# `onUpdate`

## Description

The `onUpdate` property allows you to subscribe to collection updates.

When the collection changes (such as adding, removing, patching, clearing, etc.), the function assigned to `onUpdate` will be called with a `CollectionUpdateEvent`.

---

## Syntax

```ts
collection.onUpdate = (event) => {
  // handle the update event
};
```

- **event** — an instance of `CollectionUpdateEvent`, containing the current list of items at the moment of the update.

---

## Behavior

- `onUpdate` is triggered only after a successful modification of the collection.
- If the update event is stopped using `stopImmediatePropagation()`, listeners added via `addEventListener('update')` will not be called, but `onUpdate` will still fire.
- You can replace the current handler by assigning a new function to `onUpdate`.
- To remove the handler, set `collection.onUpdate = null`.

---

## Examples

### Simple subscription to updates

```ts
collection.onUpdate = (event) => {
  console.log("Collection updated. Number of items:", event.detail.length);
};
```

---

### Inspecting event contents

```ts
collection.onUpdate = (event) => {
  for (const item of event.detail) {
    console.log("Item in collection:", item);
  }
};
```

---

### Stopping further event propagation

```ts
collection.onUpdate = (event) => {
  event.stopImmediatePropagation();
  console.log("Update handled only here");
};
```

# `constructor`

## Description

The `Collection` constructor creates a new collection of items, with support for using a primary key to uniquely identify each item.

> 📚 **Important:** If the `primaryKey` option is not specified, the default field `key` will be used.

---

## Syntax

```ts
const collection = new Collection(options?);
```

- **`options.initialItems`** — an initial array of items to populate the collection.
- **`options.primaryKey`** — the field name used as the unique identifier for each item (defaults to `'key'`).
- **Returns** — a new instance of the collection.

---

## Behavior

1. Initializes an empty collection or populates it with the provided initial items.
2. Configures the `primaryKey` used for item identification.
3. Initial items are added using `setItems`, triggering the `insert:*` hooks for each item.
4. After creation, the collection is ready for use.

---

## Typing

The `Collection` constructor supports generics for precise typing of the collection:

```ts
Collection<PrimaryKey extends string, PrimaryKeyType extends string | number | bigint, ItemData extends object>
```

- **`PrimaryKey`** — the name of the field that serves as the primary key for each item (default is `'key'`).
- **`PrimaryKeyType`** — the type of the primary key value (`string`, `number`, or `bigint`).
- **`ItemData`** — the shape of each item object, including the primary key field.

### Example of custom typing

```ts
const collection = new Collection<'id', number, { id: number; name: string }>({
  primaryKey: 'id',
  initialItems: [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Alice' },
  ],
});

collection.appendItem({ id: 3, name: 'Bob' });

console.log(collection.getItem(3));
// { id: 3, name: 'Bob' }
```

---

## Examples

### Creating an empty collection

```ts
const collection = new Collection();

console.log(collection.numItems); // 0
```

---

### Creating a collection with initial items

```ts
const collection = new Collection({
  initialItems: [
    { key: 'user1', name: 'John Doe' },
    { key: 'user2', name: 'Alice' },
  ],
});

console.log(collection.numItems); // 2
console.log(collection.getItem('user1'));
// { key: 'user1', name: 'John Doe' }
```

---

### Using a custom primary key

```ts
const collection = new Collection({
  primaryKey: 'id',
  initialItems: [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Alice' },
  ],
});

console.log(collection.getItem(1));
// { id: 1, name: 'John Doe' }
```

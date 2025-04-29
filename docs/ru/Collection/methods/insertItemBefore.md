# `insertItemBefore`

## Описание

Метод `insertItemBefore` вставляет новый элемент в коллекцию сразу перед указанным элементом по его первичному ключу.
Если элемент с таким ключом не найден, новый элемент добавляется в конец коллекции.
После вставки будет вызвано событие обновления (`update`).

> ℹ️ **Особенности:**
>
> - Если элемент с таким ключом существует, новый элемент вставляется перед ним.
> - Если элемент не найден, поведение аналогично `appendItem`.

---

## Синтаксис

```ts
collectionInstance.insertItemBefore(key, item): boolean;
```

- **`key`** — первичный ключ элемента, перед которым нужно вставить новый элемент.
- **`item`** — элемент, который нужно вставить.
- **Возвращает** — `true`, если элемент успешно вставлен, иначе `false`.

---

## Поведение

1. Выполняется поиск целевого элемента по ключу.
2. Вызывается хук `insert:before`.
3. Если целевой элемент найден:

- Новый элемент вставляется в коллекцию сразу перед ним.

4. Если целевой элемент не найден:

- Новый элемент добавляется в конец коллекции (как `appendItem`).

5. Вызывается хук `insert:after`.
6. Вызывается событие `update`.

---

## Примеры

### Вставка элемента перед существующим

```ts
const collection = new Collection({
  initialItems: [
    { key: "user1", name: "John Doe" },
    { key: "user2", name: "Alice" },
  ],
});

collection.insertItemBefore("user2", { key: "user3", name: "Bob" });

console.log(Array.from(collection));
// [
//   { key: 'user1', name: 'John Doe' },
//   { key: 'user3', name: 'Bob' },
//   { key: 'user2', name: 'Alice' }
// ]
```

---

### Вставка элемента, если целевой элемент не найден

```ts
const collection = new Collection({
  initialItems: [{ key: "user1", name: "John Doe" }],
});

collection.insertItemBefore("nonexistent", { key: "user2", name: "Alice" });

console.log(Array.from(collection));
// [
//   { key: 'user1', name: 'John Doe' },
//   { key: 'user2', name: 'Alice' }
// ]
```

---

### Использование с кастомным первичным ключом

```ts
const collection = new Collection({
  primaryKey: "id",
  initialItems: [{ id: 1, name: "John Doe" }],
});

collection.insertItemBefore(1, { id: 2, name: "Alice" });

console.log(Array.from(collection));
// [
//   { id: 2, name: 'Alice' },
//   { id: 1, name: 'John Doe' }
// ]
```

# `removeItem`

## Описание

Метод `removeItem` удаляет элемент из коллекции по его первичному ключу.
Если элемент найден и успешно удалён, то будет вызвано событие обновления (`update`).

---

## Синтаксис

```ts
collectionInstance.removeItem(key): boolean;
```

- **`key`** — первичный ключ элемента, который нужно удалить.
- **Возвращает** — `true`, если элемент был найден и удалён, иначе `false`.

---

## Поведение

1. Ищется элемент по указанному первичному ключу.
2. Если элемент найден:

- Вызывается хук `remove:before`.
- Элемент удаляется из коллекции и внутреннего индекса.
- Вызывается хук `remove:after`.
- Вызывается событие `update`.

3. Если элемент не найден, метод возвращает `false` без вызова хуков и событий.

---

## Примеры

### Удаление существующего элемента

```ts
const collection = new Collection({
  initialItems: [
    { key: "user1", name: "John Doe" },
    { key: "user2", name: "Alice" },
  ],
});

const removed = collection.removeItem("user1");

console.log(removed); // true
console.log(Array.from(collection));
// [ { key: 'user2', name: 'Alice' } ]
```

---

### Попытка удаления несуществующего элемента

```ts
const collection = new Collection({
  initialItems: [{ key: "user1", name: "John Doe" }],
});

const removed = collection.removeItem("user2");

console.log(removed); // false
console.log(Array.from(collection));
// [ { key: 'user1', name: 'John Doe' } ]
```

---

### Использование кастомного первичного ключа

```ts
const collection = new Collection({
  primaryKey: "id",
  initialItems: [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ],
});

const removed = collection.removeItem(1);

console.log(removed); // true
console.log(Array.from(collection));
// [ { id: 2, name: 'Bob' } ]
```

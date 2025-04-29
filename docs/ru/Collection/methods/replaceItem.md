# `replaceItem`

## Описание

Метод `replaceItem` заменяет существующий элемент в коллекции новым элементом по указанному первичному ключу.
Если элемент с таким ключом отсутствует, то новый элемент будет добавлен в конец коллекции.

---

## Синтаксис

```ts
collectionInstance.replaceItem(key, item): boolean;
```

- **`key`** — первичный ключ элемента, который нужно заменить.
- **`item`** — новый элемент для вставки.
- **Возвращает** — `true`, если операция прошла успешно.

---

## Поведение

1. Проверяется валидность нового элемента.
2. Ищется существующий элемент по переданному ключу.
3. Если элемент найден:
   - Вызывается хук `remove:before`.
   - Старый элемент удаляется.
   - Вызывается хук `remove:after`.
4. Вызывается хук `insert:before`.
5. Новый элемент вставляется на место старого.
6. Вызывается хук `insert:after`.
7. Вызывается событие `update`.

Если элемент не найден, новый элемент будет добавлен в конец коллекции.

---

## Примеры

### Замена существующего элемента

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

### Добавление нового элемента через replaceItem

```ts
const collection = new Collection();

collection.replaceItem("user3", { key: "user3", name: "Charlie" });

console.log(collection.getItem("user3"));
// { key: 'user3', name: 'Charlie' }
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

collection.replaceItem(1, { id: 1, name: "Alicia" });

console.log(collection.getItem(1));
// { id: 1, name: 'Alicia' }
```

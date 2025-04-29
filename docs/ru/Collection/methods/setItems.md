# `setItems`

## Описание

Метод `setItems` полностью заменяет содержимое коллекции на новые переданные элементы.
После успешной замены будет вызвано событие обновления (`update`).

---

## Синтаксис

```ts
collectionInstance.setItems(items[]): boolean;
```

- **`items`** — массив новых элементов для коллекции.
- **Возвращает** — `true`, если были успешно добавлены элементы; иначе `false`.

---

## Поведение

1. Если коллекция не пуста, вызывается метод `clear()` вместе с хуками `clear:*`.
2. Для каждого нового элемента вызываются хуки `insert:before` и `insert:after`.
3. После завершения добавления всех элементов вызывается событие `update`.

---

## Примеры

### Полная замена элементов коллекции

```ts
const collection = new Collection({
  initialItems: [
    { key: "user1", name: "John Doe" },
    { key: "user2", name: "Alice" },
  ],
});

collection.setItems([
  { key: "user3", name: "Bob" },
  { key: "user4", name: "Charlie" },
]);

console.log(collection.numItems); // 2
console.log(Array.from(collection));
// [ { key: 'user3', name: 'Bob' }, { key: 'user4', name: 'Charlie' } ]
```

---

### Использование с кастомным первичным ключом

```ts
const collection = new Collection({
  primaryKey: "id",
  initialItems: [
    { id: "foo", title: "First" },
    { id: "bar", title: "Second" },
  ],
});

collection.setItems([
  { id: "baz", title: "Third" },
  { id: "qux", title: "Fourth" },
]);

console.log(collection.numItems); // 2
console.log(collection.getItem("baz"));
// { id: 'baz', title: 'Third' }
```

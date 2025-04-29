# `appendItem`

## Описание

Метод `appendItem` добавляет новый элемент в конец коллекции. Если элемент с таким же первичным ключом уже существует, то он будет заменён новым элементом. После успешного добавления будет вызвано событие обновления (`update`).

---

## Синтаксис

```ts
collectionInstance.appendItem(item): boolean;
```

- **`item`** — элемент, который нужно добавить.
- **Возвращает** — `true`, если элемент был успешно добавлен, в противном случае — `false`.

---

## Поведение

1. Проверяется наличие корректного первичного ключа.
2. Вызывается хук `insert:before`.
3. Если элемент с таким ключом уже есть, он заменяется новым (старый элемент будет удалён с вызовом хуков `remove:*`).
4. Вызывается хук `insert:after`.
5. Вызывается событие `update`.

---

## Примеры

### Базовое использование

```ts
const collection = new Collection();

collection.appendItem({ key: "user1", name: "John Doe" });

console.log(collection.numItems); // 1
console.log(collection.getItem("user1"));
// { key: 'user1', name: 'John Doe' }
```

---

### Замена существующего элемента

```ts
const collection = new Collection({
  initialItems: [{ key: "user1", name: "John Doe" }],
});

collection.appendItem({ key: "user1", name: "Jane Smith" });

console.log(collection.numItems); // 1 (старый элемент заменён)
console.log(collection.getItem("user1"));
// { key: 'user1', name: 'Jane Smith' }
```

---

### Добавление нескольких элементов

```ts
const collection = new Collection();

collection.appendItem({ key: "user2", name: "Alice" });
collection.appendItem({ key: "user3", name: "Bob" });

console.log(collection.numItems); // 2
console.log(collection.getItem("user2"));
// { key: 'user2', name: 'Alice' }
console.log(collection.getItem("user3"));
// { key: 'user3', name: 'Bob' }
```

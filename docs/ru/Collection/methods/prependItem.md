# `prependItem`

## Описание

Метод `prependItem` добавляет новый элемент в начало коллекции.
Если элемент с таким же первичным ключом уже существует, то он будет заменён новым элементом.
После успешного добавления будет вызвано событие обновления (`update`).

---

## Синтаксис

```ts
collectionInstance.prependItem(item): boolean;
```

- **`item`** — элемент, который нужно добавить в коллекцию.
- **Возвращает** — `true`, если элемент был успешно добавлен, иначе `false`.

---

## Поведение

1. Проверяется наличие корректного первичного ключа у элемента.
2. Вызывается хук `insert:before`.
3. Если элемент с таким ключом уже есть, то он удаляется с вызовом хуков `remove:*`.
4. Новый элемент вставляется в начало коллекции.
5. Вызывается хук `insert:after`.
6. Вызывается событие `update`.

---

## Примеры

### Добавление нового элемента в начало

```ts
const collection = new Collection({
  initialItems: [
    { key: 'user2', name: 'Alice' },
    { key: 'user3', name: 'Bob' },
  ],
});

collection.prependItem({ key: 'user1', name: 'John Doe' });

console.log(Array.from(collection));
// [
//   { key: 'user1', name: 'John Doe' },
//   { key: 'user2', name: 'Alice' },
//   { key: 'user3', name: 'Bob' },
// ]
```

---

### Замена элемента при совпадении ключа

```ts
const collection = new Collection({
  initialItems: [
    { key: 'user1', name: 'Old John' },
    { key: 'user2', name: 'Alice' },
  ],
});

collection.prependItem({ key: 'user1', name: 'New John' });

console.log(Array.from(collection));
// [
//   { key: 'user1', name: 'New John' },
//   { key: 'user2', name: 'Alice' },
// ]
```

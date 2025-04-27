# `appendItemAt`

## Описание

Метод `appendItemAt` добавляет новый элемент в коллекцию на указанную позицию (индекс).  
Если элемент с таким же первичным ключом уже существует, то он будет заменён новым элементом.  
После успешного добавления будет вызвано событие обновления (`update`).

---

## Синтаксис

```ts
collectionInstance.appendItemAt(item, index): boolean;
```

- **`item`** — элемент, который нужно добавить.
- **`index`** — позиция в коллекции, куда будет вставлен элемент.
- **Возвращает** — `true`, если элемент был успешно добавлен, в противном случае — `false`.

---

## Поведение

1. Проверяется наличие корректного первичного ключа.
2. Вызывается хук `insert:before`.
3. Если элемент с таким ключом уже есть, он заменяется новым (старый элемент будет удалён с вызовом хуков `remove:*`).
4. Новый элемент вставляется на указанную позицию (индекс корректируется в допустимые границы).
5. Вызывается хук `insert:after`.
6. Вызывается событие `update`.

---

## Примеры

### Базовое добавление в начало коллекции

```ts
const collection = new Collection();

collection.appendItem({ key: 'user2', name: 'Alice' });
collection.appendItemAt({ key: 'user1', name: 'John Doe' }, 0);

console.log(collection.numItems); // 2
console.log(Array.from(collection));
// [ { key: 'user1', name: 'John Doe' }, { key: 'user2', name: 'Alice' } ]
```

---

### Добавление элемента в середину коллекции

```ts
const collection = new Collection();

collection.appendItem({ key: 'user1', name: 'John Doe' });
collection.appendItem({ key: 'user3', name: 'Charlie' });
collection.appendItemAt({ key: 'user2', name: 'Alice' }, 1);

console.log(collection.numItems); // 3
console.log(Array.from(collection));
// [ { key: 'user1', name: 'John Doe' }, { key: 'user2', name: 'Alice' }, { key: 'user3', name: 'Charlie' } ]
```

---

### Замена существующего элемента при вставке

```ts
const collection = new Collection({
  initialItems: [{ key: 'user1', name: 'Old User' }],
});

collection.appendItemAt({ key: 'user1', name: 'Updated User' }, 0);

console.log(collection.numItems); // 1
console.log(collection.getItem('user1'));
// { key: 'user1', name: 'Updated User' }
```

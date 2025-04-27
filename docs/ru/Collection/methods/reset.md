# `reset`

## Описание

Метод `reset` сбрасывает коллекцию в начальное состояние, восстановленное из массива `initialItems`, переданного в конструктор.
После успешного сброса будет вызвано событие обновления (`update`).

---

## Синтаксис

```ts
collectionInstance.reset(): void;
```

- **Возвращает** — `true`, если были успешно добавлены элементы после сброса; иначе `false`.

---

## Поведение

1. Если коллекция не пуста, вызывается метод `clear()` вместе с хуками `clear:*`.
2. Восстанавливаются элементы из `initialItems`, для каждого элемента вызываются хуки `insert:before` и `insert:after`.
3. Вызывается событие `update`.

---

## Примеры

### Сброс коллекции к начальному состоянию

```ts
const collection = new Collection({
  initialItems: [
    { key: 'user1', name: 'John Doe' },
    { key: 'user2', name: 'Alice' },
  ],
});

collection.appendItem({ key: 'user3', name: 'Bob' });

console.log(collection.numItems); // 3

collection.reset();

console.log(collection.numItems); // 2
console.log(Array.from(collection));
// [ { key: 'user1', name: 'John Doe' }, { key: 'user2', name: 'Alice' } ]
```

---

### Сброс коллекции с кастомным первичным ключом

```ts
const collection = new Collection({
  primaryKey: 'id',
  initialItems: [
    { id: 'foo', title: 'First' },
    { id: 'bar', title: 'Second' },
  ],
});

collection.appendItem({ id: 'baz', title: 'Third' });
collection.reset();

console.log(collection.numItems); // 2
console.log(collection.getItem('foo'));
// { id: 'foo', title: 'First' }
```

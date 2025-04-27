# `clear`

## Описание

Метод `clear` полностью очищает коллекцию, удаляя все элементы и сбрасывая внутренние индексы.  
После очистки будет вызвано событие обновления (`update`).

> ⚠️ **Важно:** хуки `remove:*` не вызываются для каждого удаляемого элемента. При очистке вызываются только хуки `clear:before` и `clear:after` с целью обеспечения максимальной производительности.

---

## Синтаксис

```ts
collectionInstance.clear(): boolean;
```

- **Возвращает** — `true`, если коллекция была успешно очищена, иначе `false` (если была отмена через хук или коллекция уже пуста).

---

## Поведение

1. Если коллекция уже пуста — метод возвращает `false`, ничего не происходит.
2. Перед удалением всех элементов вызывается хук `clear:before`.
   - Если хук отменяет операцию, очистка прерывается, метод возвращает `false`.
3. Удаляются все элементы из коллекции и внутреннего индекса.
4. После удаления вызывается хук `clear:after`.
5. Вызывается событие `update`.
6. Метод возвращает `true`.

---

## Примеры

### Очистка коллекции

```ts
const collection = new Collection({
  initialItems: [
    { key: 'user1', name: 'John Doe' },
    { key: 'user2', name: 'Alice' },
  ],
});

console.log(collection.numItems); // 2

const result = collection.clear();

console.log(result); // true
console.log(collection.numItems); // 0
console.log(Array.from(collection)); // []
```

---

### Повторное использование коллекции после очистки

```ts
const collection = new Collection();

collection.appendItem({ key: 'user1', name: 'John Doe' });
collection.clear();
collection.appendItem({ key: 'user2', name: 'Alice' });

console.log(collection.numItems); // 1
console.log(collection.getItem('user2'));
// { key: 'user2', name: 'Alice' }
```

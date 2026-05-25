# `constructor`

## Описание

Конструктор `CollectionUpdateEvent` создаёт новое событие обновления коллекции с типом `'update'`.  
Событие содержит актуальный список элементов коллекции после изменений.

> 📚 **Важно:** Это специализированное событие для внутреннего использования в коллекциях. Оно позволяет отслеживать изменения без необходимости вручную управлять состоянием.

---

## Синтаксис

```ts
const event = new CollectionUpdateEvent(items);
```

- **`items`** — новый массив элементов коллекции.
- **Возвращает** — экземпляр `CollectionUpdateEvent`.

---

## Поведение

1. Создаёт кастомное событие типа `'update'`.
2. Сохраняет переданный массив элементов в поле `detail` **как есть** — без копирования. Коллекция передаёт сюда замороженный снимок, поэтому `event.detail === collection.items` внутри обработчика.
3. Поддерживает механизм `stopImmediatePropagation()` для контроля распространения события. При его вызове внутри `onUpdate` коллекция также пропускает последующий `dispatchEvent` к обычным `addEventListener('update', ...)` слушателям.

---

## Типизация

Конструктор поддерживает generics для уточнения структуры элементов:

```ts
CollectionUpdateEvent<PrimaryKey extends string, PrimaryKeyType extends string | number | bigint, ItemData extends object>
```

- **`PrimaryKey`** — название поля первичного ключа (по умолчанию `'key'`).
- **`PrimaryKeyType`** — тип значения ключа (`string`, `number` или `bigint`).
- **`ItemData`** — структура объекта элемента.

### Пример типизации

```ts
const event = new CollectionUpdateEvent<
  'id',
  number,
  { id: number; name: string }
>([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Alice' },
]);

console.log(event.type); // "update"
console.log(event.detail);
// [
//   { id: 1, name: 'John Doe' },
//   { id: 2, name: 'Alice' },
// ]
```

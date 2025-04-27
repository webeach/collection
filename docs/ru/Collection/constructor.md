# `constructor`

## Описание

Конструктор `Collection` создаёт новую коллекцию элементов с поддержкой первичного ключа для идентификации каждого элемента.

> 📚 **Важно:** Если не указан параметр `primaryKey`, по умолчанию используется поле `key`.

---

## Синтаксис

```ts
const collection = new Collection(options?);
```

- **`options.initialItems`** — начальный массив элементов для заполнения коллекции.
- **`options.primaryKey`** — название поля, которое будет использоваться в качестве уникального идентификатора элемента (по умолчанию `'key'`).
- **Возвращает** — новый экземпляр коллекции.

---

## Поведение

1. Инициализирует пустую коллекцию или наполняет её начальными элементами.
2. Настраивает `primaryKey` для идентификации элементов.
3. Начальные элементы добавляются через `setItems`, при этом на каждый элемент срабатывают хуки `insert:*`.
4. После создания коллекция готова к использованию.

---

## Типизация

Конструктор `Collection` поддерживает generics для точной настройки типа коллекции:

```ts
Collection<PrimaryKey extends string, PrimaryKeyType extends string | number | bigint, ItemData extends object>
```

- **`PrimaryKey`** — название поля в объекте, которое будет использоваться как первичный ключ для элемента (по умолчанию `'key'`).
- **`PrimaryKeyType`** — тип значения первичного ключа (`string`, `number` или `bigint`).
- **`ItemData`** — структура объекта элемента коллекции, включая сам первичный ключ.

### Пример кастомной типизации

```ts
const collection = new Collection<'id', number, { id: number; name: string }>({
  primaryKey: 'id',
  initialItems: [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Alice' },
  ],
});

collection.appendItem({ id: 3, name: 'Bob' });

console.log(collection.getItem(3));
// { id: 3, name: 'Bob' }
```

---

## Примеры

### Создание пустой коллекции

```ts
const collection = new Collection();

console.log(collection.numItems); // 0
```

---

### Создание коллекции с начальными элементами

```ts
const collection = new Collection({
  initialItems: [
    { key: 'user1', name: 'John Doe' },
    { key: 'user2', name: 'Alice' },
  ],
});

console.log(collection.numItems); // 2
console.log(collection.getItem('user1'));
// { key: 'user1', name: 'John Doe' }
```

---

### Использование кастомного первичного ключа

```ts
const collection = new Collection({
  primaryKey: 'id',
  initialItems: [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Alice' },
  ],
});

console.log(collection.getItem(1));
// { id: 1, name: 'John Doe' }
```

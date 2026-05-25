# `items`

## Описание

Свойство `items` возвращает текущий снимок (snapshot) элементов коллекции в виде замороженного массива.

Снимок пересоздаётся **один раз на каждую успешную мутацию** прямо перед отправкой события `update`. Между мутациями ссылка стабильна, что позволяет дёшево (`O(1)`) проверять, изменилась ли коллекция, через сравнение по ссылке.

> 📚 **Важно:** возвращаемый массив заморожен через `Object.freeze`. Любая попытка изменить его извне завершится ошибкой (в `strict mode`) или будет молча проигнорирована.

---

## Синтаксис

```ts
const snapshot = collection.items;
```

- **Возвращает** — `ReadonlyArray<CollectionItem>` — замороженный массив элементов на момент последней мутации.

---

## Поведение

1. После каждой успешной мутации (`appendItem`, `removeItem`, `clear`, и т.д.) создаётся новый замороженный массив-снимок.
2. До следующей мутации повторные обращения к `collection.items` возвращают одну и ту же ссылку.
3. Внутри обработчика `update`-события выполняется равенство:
   ```ts
   event.detail === collection.items; // true
   ```
4. Активные итерации (`forEach`, `for...of`) ведутся по снимку, существовавшему на момент старта обхода, и не затрагиваются последующими мутациями.

---

## Примеры

### Базовое чтение элементов

```ts
const collection = new Collection({
  initialItems: [
    { key: 'user1', name: 'John Doe' },
    { key: 'user2', name: 'Alice' },
  ],
});

console.log(collection.items);
// [
//   { key: 'user1', name: 'John Doe' },
//   { key: 'user2', name: 'Alice' },
// ]
```

---

### Дешёвая проверка изменений по ссылке

```ts
const before = collection.items;

collection.appendItem({ key: 'user3', name: 'Bob' });

const after = collection.items;

console.log(before === after); // false — коллекция изменилась
```

```ts
const a = collection.items;
const b = collection.items;

console.log(a === b); // true — между мутациями ссылка стабильна
```

---

### Общая ссылка с `event.detail`

```ts
collection.onUpdate = (event) => {
  console.log(event.detail === collection.items); // true
};

collection.appendItem({ key: 'user4', name: 'Charlie' });
```

---

### Попытка мутации заблокирована

```ts
const snapshot = collection.items;

snapshot.push({ key: 'user5', name: 'Eve' });
// TypeError: Cannot add property … object is not extensible (в strict mode)
```

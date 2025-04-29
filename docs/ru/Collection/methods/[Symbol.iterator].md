# `[Symbol.iterator]`

## Описание

Метод `[Symbol.iterator]` делает коллекцию итерируемой с помощью стандартных средств JavaScript, таких как `for...of` и `Array.from`.

> 📚 **Важно:** Итератор возвращает копию текущего списка элементов на момент вызова.
> Это защищает от ошибок, связанных с изменением коллекции во время итерации.

---

## Синтаксис

```ts
for (const item of collectionInstance) {
  // обработка элемента
}

// или

const array = Array.from(collectionInstance);
```

- **Возвращает** — итератор элементов коллекции.

---

## Поведение

1. Создаётся копия всех текущих элементов коллекции.
2. Итерация происходит по этой копии.
3. Изменения коллекции в процессе итерации не влияют на уже начатую итерацию.

---

## Примеры

### Перебор коллекции через `for...of`

```ts
const collection = new Collection({
  initialItems: [
    { key: "user1", name: "John Doe" },
    { key: "user2", name: "Alice" },
  ],
});

for (const item of collection) {
  console.log(item);
}
// { key: 'user1', name: 'John Doe' }
// { key: 'user2', name: 'Alice' }
```

---

### Преобразование коллекции в массив

```ts
const collection = new Collection({
  initialItems: [
    { key: "user1", name: "John Doe" },
    { key: "user2", name: "Alice" },
  ],
});

const itemsArray = Array.from(collection);

console.log(itemsArray);
// [ { key: 'user1', name: 'John Doe' }, { key: 'user2', name: 'Alice' } ]
```

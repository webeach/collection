# `getItem`

## Описание

Метод `getItem` позволяет получить элемент коллекции по его первичному ключу.
Если элемент с указанным ключом существует, возвращается его объект. Если элемента нет — возвращается `null`.

> ℹ️ **Особенности:**
>
> - Поиск элемента происходит через внутренний `Map`, что обеспечивает быструю (O(1)) скорость доступа.

---

## Синтаксис

```ts
collectionInstance.getItem(key): Item | null;
```

- **`key`** — значение первичного ключа элемента, который нужно найти.
- **Возвращает** — объект элемента или `null`, если элемент не найден.

---

## Поведение

1. Выполняется поиск элемента в `Map` коллекции по переданному ключу.
2. Если элемент найден, он возвращается.
3. Если элемент не найден, возвращается `null`.

---

## Примеры

### Получение элемента по ключу

```ts
const collection = new Collection({
  initialItems: [
    { key: "user1", name: "John Doe" },
    { key: "user2", name: "Alice" },
  ],
});

const user = collection.getItem("user1");

console.log(user);
// { key: 'user1', name: 'John Doe' }
```

---

### Обработка отсутствующего элемента

```ts
const collection = new Collection({
  initialItems: [{ key: "user1", name: "John Doe" }],
});

const user = collection.getItem("nonexistent");

console.log(user); // null
```

---

### Использование коллекции с кастомным первичным ключом

```ts
const collection = new Collection({
  primaryKey: "id",
  initialItems: [
    { id: 101, name: "John Doe" },
    { id: 102, name: "Alice" },
  ],
});

const user = collection.getItem(101);

console.log(user);
// { id: 101, name: 'John Doe' }
```

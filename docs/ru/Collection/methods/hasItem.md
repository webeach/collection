# `hasItem`

## Описание

Метод `hasItem` позволяет проверить наличие элемента в коллекции по его первичному ключу.
Возвращает булево значение: `true`, если элемент существует, и `false`, если нет.

> ℹ️ **Особенности:**
>
> - Проверка осуществляется через внутренний `Map`, что обеспечивает очень быструю (O(1)) проверку.

---

## Синтаксис

```ts
collectionInstance.hasItem(key): boolean;
```

- **`key`** — значение первичного ключа элемента, который нужно проверить.
- **Возвращает** — `true`, если элемент существует, иначе `false`.

---

## Поведение

1. Выполняется проверка наличия ключа в `Map` коллекции.
2. Возвращается результат проверки.

---

## Примеры

### Проверка существующего элемента

```ts
const collection = new Collection({
  initialItems: [
    { key: "user1", name: "John Doe" },
    { key: "user2", name: "Alice" },
  ],
});

console.log(collection.hasItem("user1")); // true
```

---

### Проверка отсутствующего элемента

```ts
const collection = new Collection({
  initialItems: [{ key: "user1", name: "John Doe" }],
});

console.log(collection.hasItem("nonexistent")); // false
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

console.log(collection.hasItem(101)); // true
console.log(collection.hasItem(999)); // false
```

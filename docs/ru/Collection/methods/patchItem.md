# `patchItem`

## Описание

Метод `patchItem` обновляет существующий элемент в коллекции по указанному первичному ключу.
Метод изменяет только переданные поля, не затрагивая остальные данные элемента.
После успешного обновления будет вызвано событие обновления (`update`).

> ⚠️ **Важно:** при патче новый первичный ключ будет проигнорирован. В коллекции сохранится исходный ключ элемента.

---

## Синтаксис

```ts
collectionInstance.patchItem(key, patchData): boolean;
```

- **`key`** — первичный ключ элемента, который нужно обновить.
- **`patchData`** — частичные данные для обновления.
- **Возвращает** — `true`, если элемент был успешно обновлен, иначе `false`.

---

## Поведение

1. Ищется элемент по первичному ключу.
2. Если элемент найден:

- Вызывается хук `patch:before`.
- Объединяются текущие данные элемента с `patchData`.
- Первичный ключ принудительно сохраняется без изменений.
- Вызывается хук `patch:after`.
- Вызывается событие `update`.

3. Если элемент не найден, возвращается `false`.

---

## Примеры

### Частичное обновление элемента

```ts
const collection = new Collection({
  initialItems: [{ key: "user1", name: "John Doe", age: 30 }],
});

collection.patchItem("user1", { age: 31 });

console.log(collection.getItem("user1"));
// { key: 'user1', name: 'John Doe', age: 31 }
```

---

### Попытка изменить первичный ключ

```ts
const collection = new Collection({
  initialItems: [{ key: "user1", name: "John Doe" }],
});

collection.patchItem("user1", { key: "newKey" } as any);

console.log(collection.getItem("user1"));
// { key: 'user1', name: 'John Doe' }
```

---

### Использование с кастомным первичным ключом

```ts
const collection = new Collection({
  primaryKey: "id",
  initialItems: [{ id: 1, name: "Alice", age: 25 }],
});

collection.patchItem(1, { age: 26 });

console.log(collection.getItem(1));
// { id: 1, name: 'Alice', age: 26 }
```

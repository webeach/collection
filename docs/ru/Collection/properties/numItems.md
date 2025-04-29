# `numItems`

## Описание

Свойство `numItems` возвращает текущее количество элементов в коллекции.

Это свойство только для чтения, которое всегда отражает актуальное состояние коллекции после всех операций добавления, удаления, очистки и замены элементов.

---

## Синтаксис

```ts
const count = collection.numItems;
```

- **count** — число элементов в коллекции.

---

## Примеры

### Получение количества элементов

```ts
const collection = new Collection<"id", string, { id: string; label: string }>({
  primaryKey: "id",
});

console.log(collection.numItems); // 0

collection.appendItem({ id: "a", label: "First" });
collection.appendItem({ id: "b", label: "Second" });

console.log(collection.numItems); // 2
```

### После удаления элемента

```ts
collection.removeItem("a");

console.log(collection.numItems); // 1
```

### После очистки коллекции

```ts
collection.clear();

console.log(collection.numItems); // 0
```

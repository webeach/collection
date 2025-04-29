# `insert:*`

## Описание

Хуки `insert:before` и `insert:after` срабатывают при добавлении нового элемента в коллекцию.

- `insert:before` вызывается **до** вставки элемента.
- `insert:after` вызывается **после** успешной вставки элемента.

Хуки позволяют перехватывать процесс вставки, изменять данные или отменять операцию.

---

## Синтаксис хука

```ts
hook({
  item,
  index,
  meta,
}): boolean | void;
```

- **item** — элемент, который добавляется.
- **index** — индекс, в который вставляется элемент.
- **meta** — мета-информация коллекции (например, ключ первичного поля).
- **Возвращаемое значение**:
  - Если `insert:before` возвращает `false`, операция вставки отменяется.
  - `insert:after` не влияет на ход операции.

---

## Поведение

- `insert:before` может заблокировать вставку, вернув `false`.
- `insert:after` вызывается всегда после успешного добавления.
- Если несколько хуков зарегистрированы, они вызываются в порядке регистрации.

---

## Примеры

### Блокировка вставки при определённых условиях

```ts
collection[$CollectionHookDispatcherSymbol].register(
  "insert:before",
  ({ item }) => {
    if (item.type === "forbidden") {
      return false; // Блокируем вставку запрещённого типа
    }
  },
);
```

### Модификация элемента перед вставкой

```ts
collection[$CollectionHookDispatcherSymbol].register(
  "insert:before",
  ({ item }) => {
    item.createdAt = new Date();
  },
);
```

### Реакция на успешную вставку

```ts
collection[$CollectionHookDispatcherSymbol].register(
  "insert:after",
  ({ item, index, meta }) => {
    console.log(
      `Элемент с ключом ${item[meta.primaryKey]} успешно вставлен на позицию ${index}`,
    );
  },
);
```

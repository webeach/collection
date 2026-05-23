<div align="center">
  <p>
    <img alt="collection" src="./assets/logo.svg" width="640">
  </p>
  <p>
    <a href="https://www.npmjs.com/package/@webeach/collection">
      <img src="https://img.shields.io/npm/v/@webeach/collection?style=flat-square&labelColor=0A1A3D&color=2E6BFF" alt="npm version" />
    </a>
    <a href="https://github.com/webeach/collection/actions">
      <img src="https://img.shields.io/github/actions/workflow/status/webeach/collection/ci.yml?style=flat-square&labelColor=0A1A3D&color=2E6BFF" alt="build" />
    </a>
    <a href="https://www.npmjs.com/package/@webeach/collection">
      <img src="https://img.shields.io/npm/dw/@webeach/collection?style=flat-square&labelColor=0A1A3D&color=2E6BFF" alt="npm downloads" />
    </a>
    <a href="https://github.com/webeach/collection/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/@webeach/collection?style=flat-square&labelColor=0A1A3D&color=2E6BFF" alt="license" />
    </a>
    <a href="https://bundlephobia.com/package/@webeach/collection">
      <img src="https://img.shields.io/bundlephobia/minzip/@webeach/collection?style=flat-square&labelColor=0A1A3D&color=2E6BFF" alt="bundle size" />
    </a>
  </p>
  <p><a href="./README.md">🇺🇸 English</a> | <a href="./README.ru.md">🇷🇺 Русский</a></p>
  <p>Управляемая коллекция элементов с поддержкой хуков, событий и строгой типизацией.</p>
</div>

---

## 💎 Возможности

- Строго типизированная коллекция с настраиваемым первичным ключом
- Хуки жизненного цикла (`insert`, `patch`, `remove`, `clear`) со стадиями `before`/`after`
- Событийная модель обновлений через коллбэк `onUpdate` и `addEventListener`
- Поддержка `string`, `number` и `bigint` в качестве типов первичного ключа
- Ноль зависимостей в runtime

---

## 📦 Установка

```bash
npm install @webeach/collection
```

```bash
pnpm add @webeach/collection
```

```bash
yarn add @webeach/collection
```

### Браузер через CDN

Без сборки — загружай напрямую через [unpkg](https://unpkg.com):

```html
<script type="module">
  import { Collection } from 'https://unpkg.com/@webeach/collection';

  const users = new Collection({ primaryKey: 'id' });
  users.appendItem({ id: 1, name: 'Alice' });
</script>
```

---

## 🚀 Быстрый старт

### Добавление элементов

```ts
import { Collection } from '@webeach/collection';

const users = new Collection({
  primaryKey: 'id',
});

users.appendItem({ id: 1, firstName: 'Ivan', lastName: 'Petrov' });
users.appendItem({ id: 2, firstName: 'Jason', lastName: 'Statham' });

console.log(users.numItems); // 2
console.log(users.getItem(2)?.firstName); // 'Jason'
```

### Замена элемента

```ts
import { Collection } from '@webeach/collection';

const products = new Collection({ primaryKey: 'sku' });

products.appendItem({ sku: 'A001', name: 'Laptop' });
products.replaceItem('A001', { sku: 'A001', name: 'Laptop Pro' });

console.log(products.getItem('A001')?.name); // 'Laptop Pro'
```

### Массовая замена через `setItems`

```ts
import { Collection } from '@webeach/collection';

const tasks = new Collection({
  primaryKey: 'id',
  initialItems: [
    { id: 1, title: 'Задача 1' },
    { id: 2, title: 'Задача 2' },
  ],
});

tasks.setItems([
  { id: 3, title: 'Новая задача 3' },
  { id: 4, title: 'Новая задача 4' },
]);

console.log(tasks.numItems); // 2
console.log(tasks.getItem(3)?.title); // 'Новая задача 3'
```

### Подписка на обновления

```ts
import { Collection } from '@webeach/collection';

const list = new Collection({ primaryKey: 'id' });

list.onUpdate = (event) => {
  console.log('Коллекция обновлена:', event.detail);
};

// Или через addEventListener
list.addEventListener('update', (event) => {
  console.log('Коллекция обновлена:', event.detail);
});

list.appendItem({ id: 1, name: 'Alice' });
```

### Использование хуков жизненного цикла

```ts
import {
  Collection,
  $CollectionHookDispatcherSymbol,
} from '@webeach/collection';

const users = new Collection({ primaryKey: 'id' });

// Блокируем добавление элементов с чётными id
const { unregister } = users[$CollectionHookDispatcherSymbol].register(
  'insert:before',
  ({ item }) => {
    if (item.id % 2 === 0) {
      return false; // отменяем вставку
    }
  },
);

users.appendItem({ id: 1, name: 'Alice' }); // успешно
users.appendItem({ id: 2, name: 'Bob' }); // заблокировано

console.log(users.numItems); // 1

unregister();
```

---

## 🛠️ API

### `Collection`

- [constructor](./docs/ru/Collection/constructor.md)
- Методы
  - [appendItem](./docs/ru/Collection/methods/appendItem.md)
  - [addEventListener](https://developer.mozilla.org/ru/docs/Web/API/EventTarget/addEventListener)
  - [appendItemAt](./docs/ru/Collection/methods/appendItemAt.md)
  - [clear](./docs/ru/Collection/methods/clear.md)
  - [dispatchEvent](https://developer.mozilla.org/ru/docs/Web/API/EventTarget/dispatchEvent)
  - [forEach](./docs/ru/Collection/methods/forEach.md)
  - [getItem](./docs/ru/Collection/methods/getItem.md)
  - [hasItem](./docs/ru/Collection/methods/hasItem.md)
  - [insertItemAfter](./docs/ru/Collection/methods/insertItemAfter.md)
  - [insertItemBefore](./docs/ru/Collection/methods/insertItemBefore.md)
  - [patchItem](./docs/ru/Collection/methods/patchItem.md)
  - [prependItem](./docs/ru/Collection/methods/prependItem.md)
  - [removeEventListener](https://developer.mozilla.org/ru/docs/Web/API/EventTarget/removeEventListener)
  - [removeItem](./docs/ru/Collection/methods/removeItem.md)
  - [replaceItem](./docs/ru/Collection/methods/replaceItem.md)
  - [reset](./docs/ru/Collection/methods/reset.md)
  - [setItems](./docs/ru/Collection/methods/setItems.md)
  - [\[Symbol.iterator\]](./docs/ru/Collection/methods/[Symbol.iterator].md)
- Свойства
  - [numItems](./docs/ru/Collection/properties/numItems.md)
  - [onUpdate](./docs/ru/Collection/properties/onUpdate.md)
- Хуки
  - [clear:\*](./docs/ru/Collection/hooks/clear.md)
  - [insert:\*](./docs/ru/Collection/hooks/insert.md)
  - [patch:\*](./docs/ru/Collection/hooks/patch.md)
  - [remove:\*](./docs/ru/Collection/hooks/remove.md)

### `CollectionUpdateEvent`

- [constructor](./docs/ru/CollectionUpdateEvent/constructor.md)
- Наследует API [CustomEvent](https://developer.mozilla.org/ru/docs/Web/API/CustomEvent/CustomEvent)

---

## 🧩 TypeScript

Коллекция полностью обобщена и автоматически выводит типы на основе первичного ключа и формы данных.

```ts
import { Collection } from '@webeach/collection';

interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
}

const users = new Collection<'id', number, User>({
  primaryKey: 'id',
});

users.appendItem({ id: 1, name: 'Alice', role: 'admin' });

const user = users.getItem(1);
// user: CollectionItem<'id', number, User> | null
```

---

## 📖 Примеры из реальных проектов

### Список задач в React

```tsx
import { FC, useEffect, useRef, useState } from 'react';
import { Collection } from '@webeach/collection';

interface Task {
  id: number;
  title: string;
  done: boolean;
}

export const TaskList: FC = () => {
  const collectionRef = useRef(
    new Collection<'id', number, Task>({ primaryKey: 'id' }),
  );
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const collection = collectionRef.current;

    collection.onUpdate = (event) => {
      setTasks([...event.detail] as Task[]);
    };

    collection.appendItem({ id: 1, title: 'Купить продукты', done: false });
    collection.appendItem({ id: 2, title: 'Написать тесты', done: false });
  }, []);

  const toggle = (id: number) => {
    const item = collectionRef.current.getItem(id);

    if (item) {
      collectionRef.current.patchItem(id, { done: !item.done });
    }
  };

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id} onClick={() => toggle(task.id)}>
          {task.done ? '✓' : '○'} {task.title}
        </li>
      ))}
    </ul>
  );
};
```

### Ограничение размера коллекции через хук

```ts
import {
  Collection,
  $CollectionHookDispatcherSymbol,
} from '@webeach/collection';

function createBoundedCollection<T extends { id: number }>(maxSize: number) {
  const collection = new Collection<'id', number, T>({ primaryKey: 'id' });

  collection[$CollectionHookDispatcherSymbol].register('insert:before', () => {
    if (collection.numItems >= maxSize) {
      return false;
    }
  });

  return collection;
}

const limited = createBoundedCollection(3);

limited.appendItem({ id: 1 }); // ok
limited.appendItem({ id: 2 }); // ok
limited.appendItem({ id: 3 }); // ok
limited.appendItem({ id: 4 }); // заблокировано — лимит достигнут

console.log(limited.numItems); // 3
```

---

## 👨‍💻 Автор

Разработка и поддержка: [Руслан Мартынов](https://github.com/ruslan-mart)

Если у тебя есть предложения или найден баг — открывай issue или отправляй pull request.

---

## 📄 Лицензия

Этот пакет распространяется под [лицензией MIT](./LICENSE).

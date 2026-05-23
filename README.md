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
  <p>Managed collection of items with hooks, events, and strict type safety.</p>
</div>

---

## 💎 Features

- Strongly-typed collection with a configurable primary key
- Lifecycle hooks (`insert`, `patch`, `remove`, `clear`) with before/after stages
- Event-driven updates via `onUpdate` callback and `addEventListener`
- Full support for `string`, `number`, and `bigint` primary keys
- Zero runtime dependencies

---

## 📦 Installation

```bash
npm install @webeach/collection
```

```bash
pnpm add @webeach/collection
```

```bash
yarn add @webeach/collection
```

### Browser via CDN

No build step needed — load directly in the browser via [unpkg](https://unpkg.com):

```html
<script type="module">
  import { Collection } from 'https://unpkg.com/@webeach/collection';

  const users = new Collection({ primaryKey: 'id' });
  users.appendItem({ id: 1, name: 'Alice' });
</script>
```

---

## 🚀 Quick Start

### Adding items

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

### Replacing an item

```ts
import { Collection } from '@webeach/collection';

const products = new Collection({ primaryKey: 'sku' });

products.appendItem({ sku: 'A001', name: 'Laptop' });
products.replaceItem('A001', { sku: 'A001', name: 'Laptop Pro' });

console.log(products.getItem('A001')?.name); // 'Laptop Pro'
```

### Bulk replacing items with `setItems`

```ts
import { Collection } from '@webeach/collection';

const tasks = new Collection({
  primaryKey: 'id',
  initialItems: [
    { id: 1, title: 'Task 1' },
    { id: 2, title: 'Task 2' },
  ],
});

tasks.setItems([
  { id: 3, title: 'New Task 3' },
  { id: 4, title: 'New Task 4' },
]);

console.log(tasks.numItems); // 2
console.log(tasks.getItem(3)?.title); // 'New Task 3'
```

### Listening for updates

```ts
import { Collection } from '@webeach/collection';

const list = new Collection({ primaryKey: 'id' });

list.onUpdate = (event) => {
  console.log('Items updated:', event.detail);
};

// Or via addEventListener
list.addEventListener('update', (event) => {
  console.log('Items updated:', event.detail);
});

list.appendItem({ id: 1, name: 'Alice' });
```

### Using lifecycle hooks

```ts
import {
  Collection,
  $CollectionHookDispatcherSymbol,
} from '@webeach/collection';

const users = new Collection({ primaryKey: 'id' });

// Block insertion of items with even ids
const { unregister } = users[$CollectionHookDispatcherSymbol].register(
  'insert:before',
  ({ item }) => {
    if (item.id % 2 === 0) {
      return false; // cancel insertion
    }
  },
);

users.appendItem({ id: 1, name: 'Alice' }); // succeeds
users.appendItem({ id: 2, name: 'Bob' }); // blocked

console.log(users.numItems); // 1

unregister();
```

---

## 🛠️ API

### `Collection`

- [constructor](./docs/en/Collection/constructor.md)
- Methods
  - [appendItem](./docs/en/Collection/methods/appendItem.md)
  - [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
  - [appendItemAt](./docs/en/Collection/methods/appendItemAt.md)
  - [clear](./docs/en/Collection/methods/clear.md)
  - [dispatchEvent](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent)
  - [forEach](./docs/en/Collection/methods/forEach.md)
  - [getItem](./docs/en/Collection/methods/getItem.md)
  - [hasItem](./docs/en/Collection/methods/hasItem.md)
  - [insertItemAfter](./docs/en/Collection/methods/insertItemAfter.md)
  - [insertItemBefore](./docs/en/Collection/methods/insertItemBefore.md)
  - [patchItem](./docs/en/Collection/methods/patchItem.md)
  - [prependItem](./docs/en/Collection/methods/prependItem.md)
  - [removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)
  - [removeItem](./docs/en/Collection/methods/removeItem.md)
  - [replaceItem](./docs/en/Collection/methods/replaceItem.md)
  - [reset](./docs/en/Collection/methods/reset.md)
  - [setItems](./docs/en/Collection/methods/setItems.md)
  - [\[Symbol.iterator\]](./docs/en/Collection/methods/[Symbol.iterator].md)
- Properties
  - [numItems](./docs/en/Collection/properties/numItems.md)
  - [onUpdate](./docs/en/Collection/properties/onUpdate.md)
- Hooks
  - [clear:\*](./docs/en/Collection/hooks/clear.md)
  - [insert:\*](./docs/en/Collection/hooks/insert.md)
  - [patch:\*](./docs/en/Collection/hooks/patch.md)
  - [remove:\*](./docs/en/Collection/hooks/remove.md)

### `CollectionUpdateEvent`

- [constructor](./docs/en/CollectionUpdateEvent/constructor.md)
- Inherits [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) API

---

## 🧩 TypeScript

The collection is fully generic and infers types based on the primary key and item shape.

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

## 📖 Real-world Examples

### Tracking a list in React

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

    collection.appendItem({ id: 1, title: 'Buy groceries', done: false });
    collection.appendItem({ id: 2, title: 'Write tests', done: false });
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

### Enforcing a max size via hook

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
limited.appendItem({ id: 4 }); // blocked — limit reached

console.log(limited.numItems); // 3
```

---

## 👨‍💻 Author

Development and support: [Ruslan Martynov](https://github.com/ruslan-mart)

If you have suggestions or found a bug, feel free to open an issue or submit a pull request.

---

## 📄 License

This package is distributed under the [MIT License](./LICENSE).

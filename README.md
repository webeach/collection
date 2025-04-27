<div align="center">
  <img alt="Collection" src="./assets/logo.svg" height="192">
  <br><br><br>
  <p>
    <a href="https://www.npmjs.com/package/@webeach/collection">
      <img src="https://img.shields.io/npm/v/@webeach/collection.svg?color=104F85&labelColor=1E7EBA" alt="npm package" />
    </a>
    <a href="https://www.npmjs.com/package/@webeach/collection">
      <img src="https://img.shields.io/bundlephobia/minzip/@webeach/collection?label=size&color=104F85&labelColor=1E7EBA" alt="Bundle size" />
    </a>
    <a href="https://github.com/webeach/collection/actions/workflows/ci.yml">
      <img src="https://img.shields.io/github/actions/workflow/status/molefrog/wouter/size.yml?color=104F85&labelColor=1E7EBA" alt="build" />
    </a>
    <a href="https://www.npmjs.com/package/@webeach/collection">
      <img src="https://img.shields.io/npm/dm/@webeach/collection.svg?color=104F85&labelColor=1E7EBA" alt="npm downloads" />
    </a>
  </p>
  <p><a href="./README.md">🇺🇸 English version</a> | <a href="./README.ru.md">🇷🇺 Русская версия</a></p>
  <p>Managed collection of items with hooks, events, and strict type safety.</p>
</div>

---

## 📦 Installation

```bash
npm install @webeach/collection
```

or

```bash
pnpm install @webeach/collection
```

or

```bash
yarn add @webeach/collection
```

---

## 📥 Importing

**ES Modules**

```ts
import { Collection } from '@webeach/collection';
```

**CommonJS**

```ts
const { Collection } = require('@webeach/collection');
```

**Browser**

```html
<script type="module">
  import { Collection } from 'https://unpkg.com/@webeach/collection'; 
</script>
```

---

## 🚀 Quick Start

### Adding users

```ts
import { Collection } from '@webeach/collection';

const users = new Collection({
  primaryKey: 'id',
});

users.appendItem({
  id: 1,
  firstName: 'Ivan',
  lastName: 'Petrov',
});

users.appendItem({
  id: 2,
  firstName: 'Jason',
  lastName: 'Statham',
});

console.log(users.numItems); // 2
console.log(users.getItem(2).firstName); // Jason
```

### Adding and replacing an item

```ts
import { Collection } from '@webeach/collection';

const products = new Collection({
  primaryKey: 'sku',
});

products.appendItem({ sku: 'A001', name: 'Laptop' });
products.replaceItem('A001', { sku: 'A001', name: 'Laptop Pro' });

console.log(products.getItem('A001')?.name); // 'Laptop Pro'
```

---

### Bulk replacing items with `setItems`

```ts
import { Collection } from '@webeach/collection';

const tasks = new Collection({
  primaryKey: 'id',
  initialItems: [
    { id: 1, title: 'Initial Task 1' },
    { id: 2, title: 'Initial Task 2' },
  ],
});

// Completely replace the collection content
tasks.setItems([
  { id: 3, title: 'New Task 3' },
  { id: 4, title: 'New Task 4' },
]);

console.log(tasks.numItems); // 2
console.log(tasks.getItem(3)?.title); // 'New Task 3'
```

---

## 🛠 API

### `Collection`

+ [constructor](./docs/en/Collection/constructor.md)
+ Methods
  + [appendItem](./docs/en/Collection/methods/appendItem.md)
  + [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
  + [appendItemAt](./docs/en/Collection/methods/appendItemAt.md)
  + [clear](./docs/en/Collection/methods/clear.md)
  + [dispatchEvent](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent)
  + [forEach](./docs/en/Collection/methods/forEach.md)
  + [getItem](./docs/en/Collection/methods/getItem.md)
  + [hasItem](./docs/en/Collection/methods/hasItem.md)
  + [insertItemAfter](./docs/en/Collection/methods/insertItemAfter.md)
  + [insertItemBefore](./docs/en/Collection/methods/insertItemBefore.md)
  + [patchItem](./docs/en/Collection/methods/patchItem.md)
  + [removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)
  + [removeItem](./docs/en/Collection/methods/removeItem.md)
  + [replaceItem](./docs/en/Collection/methods/replaceItem.md)
  + [reset](./docs/en/Collection/methods/reset.md)
  + [setItems](./docs/en/Collection/methods/setItems.md)
  + [\[Symbol.iterator\]](./docs/en/Collection/methods/[Symbol.iterator].md)
+ Properties
  + [numItems](./docs/en/Collection/properties/numItems.md)
  + [onUpdate](./docs/en/Collection/properties/onUpdate.md)
+ Hooks
  + [clear:*](./docs/en/Collection/hooks/clear.md)
  + [insert:*](./docs/en/Collection/hooks/insert.md)
  + [patch:*](./docs/en/Collection/hooks/patch.md)
  + [remove:*](./docs/en/Collection/hooks/remove.md)

### `CollectionUpdateEvent`

+ [constructor](./docs/en/CollectionUpdateEvent/constructor.md)
+ Inherits [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) API

---

## 🔖 Releasing a new version

Releases are handled automatically using `semantic-release`.

Before publishing a new version, make sure:

1. All changes are committed and pushed to the `main` branch.
2. Commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format:
   - `feat: ...` — for new features
   - `fix: ...` — for bug fixes
   - `chore: ...`, `refactor: ...`, etc. — as needed
3. Versioning is automatically determined based on commit types (`patch`, `minor`, `major`).

---

## 👨‍💻 Author

Development and maintenance: [Ruslan Martynov](https://github.com/ruslan-mart)

If you have suggestions or found a bug, feel free to open an issue or submit a pull request.

---

## 📄 License

This package is distributed under the [MIT License](./LICENSE).

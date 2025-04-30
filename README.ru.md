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
    <img src="https://img.shields.io/coderabbit/prs/github/webeach/collection?utm_source=oss&utm_medium=github&utm_campaign=webeach%2Fcollection&labelColor=1E7EBA&color=104F85&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews" alt="">
  </p>
  <p><a href="./README.md">🇺🇸 English version</a> | <a href="./README.ru.md">🇷🇺 Русская версия</a></p>
  <p>Управляемая коллекция элементов с поддержкой хуков, событий и строгой типизацией.</p>
</div>

---

## 📦 Установка

```bash
npm install @webeach/collection
```

или

```bash
pnpm install @webeach/collection
```

или

```bash
yarn add @webeach/collection
```

---

## 📥 Подключение

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

## 🚀 Быстрый старт

### Добавление пользователей

```js
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

### Добавление элемента и последующая его замена

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

### Массовая замена элементов через `setItems`

```ts
import { Collection } from '@webeach/collection';

const tasks = new Collection({
  primaryKey: 'id',
  initialItems: [
    { id: 1, title: 'Initial Task 1' },
    { id: 2, title: 'Initial Task 2' },
  ],
});

// Полностью заменяем содержимое коллекции
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

+ [constructor](./docs/ru/Collection/constructor.md)
+ Методы
  + [appendItem](./docs/ru/Collection/methods/appendItem.md)
  + [addEventListener](https://developer.mozilla.org/ru/docs/Web/API/EventTarget/addEventListener)
  + [appendItemAt](./docs/ru/Collection/methods/appendItemAt.md)
  + [clear](./docs/ru/Collection/methods/clear.md)
  + [dispatchEvent](https://developer.mozilla.org/ru/docs/Web/API/EventTarget/dispatchEvent)
  + [forEach](./docs/ru/Collection/methods/forEach.md)
  + [getItem](./docs/ru/Collection/methods/getItem.md)
  + [hasItem](./docs/ru/Collection/methods/hasItem.md)
  + [insertItemAfter](./docs/ru/Collection/methods/insertItemAfter.md)
  + [insertItemBefore](./docs/ru/Collection/methods/insertItemBefore.md)
  + [patchItem](./docs/ru/Collection/methods/patchItem.md)
  + [removeEventListener](https://developer.mozilla.org/ru/docs/Web/API/EventTarget/removeEventListener)
  + [removeItem](./docs/ru/Collection/methods/removeItem.md)
  + [replaceItem](./docs/ru/Collection/methods/replaceItem.md)
  + [reset](./docs/ru/Collection/methods/reset.md)
  + [setItems](./docs/ru/Collection/methods/setItems.md)
  + [\[Symbol.iterator\]](./docs/ru/Collection/methods/[Symbol.iterator].md)
+ Свойства
  + [numItems](./docs/ru/Collection/properties/numItems.md)
  + [onUpdate](./docs/ru/Collection/properties/onUpdate.md)
+ Хуки
  + [clear:*](./docs/ru/Collection/hooks/clear.md)
  + [insert:*](./docs/ru/Collection/hooks/insert.md)
  + [patch:*](./docs/ru/Collection/hooks/patch.md)
  + [remove:*](./docs/ru/Collection/hooks/remove.md)

### `CollectionUpdateEvent`

+ [constructor](./docs/ru/CollectionUpdateEvent/constructor.md)
+ Наследует API [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)

---

## 🔖 Выпуск новой версии

Релизы обрабатываются автоматически с помощью `semantic-release`.

Перед публикацией новой версии убедись, что:

1. Все изменения закоммичены и запушены в ветку `main`.
2. Сообщения коммитов соответствуют формату [Conventional Commits](https://www.conventionalcommits.org/ru/v1.0.0/):
   - `feat: ...` — для новых фич
   - `fix: ...` — для исправлений багов
   - `chore: ...`, `refactor: ...` и другие типы — по необходимости
3. Версионирование определяется автоматически на основе типа коммитов (`patch`, `minor`, `major`).

---

## 👨‍💻 Автор

Разработка и поддержка: [Руслан Мартынов](https://github.com/ruslan-mart)

Если у тебя есть предложения или найден баг, открывай issue или отправляй pull request.

---

## 📄 Лицензия

Этот пакет распространяется под [лицензией MIT](./LICENSE).

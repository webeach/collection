import { CollectionUpdateEvent } from '../../CollectionUpdateEvent';
import { Collection } from '../Collection';
import { $CollectionHookDispatcherSymbol } from '../constants';

describe('Collection basic methods', () => {
  // --- appendItem ---
  it('appendItem should add item to empty collection', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();

    collection.appendItem({ key: 'a', value: 1 });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem('a')?.value).toBe(1);
  });

  it('appendItem should replace item with primitive key', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();

    collection.appendItem({ key: 'a', value: 1 });
    collection.appendItem({ key: 'a', value: 2 });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem('a')?.value).toBe(2);
  });

  it('appendItem should replace item with non primitive key', () => {
    const collection = new Collection<
      'key',
      unknown,
      { key: unknown; value: number }
    >();

    const key = {};

    collection.appendItem({ key, value: 1 });
    collection.appendItem({ key, value: 2 });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem(key)?.value).toBe(2);
  });

  it('appendItem should NOT replace when non-primitive keys are equal by value but not by reference', () => {
    const collection = new Collection<
      'key',
      unknown,
      { key: { a: number }; value: number }
    >();

    const key1 = { a: 1 };
    const key2 = { a: 1 };

    collection.appendItem({ key: key1, value: 1 });
    collection.appendItem({ key: key2, value: 2 });

    expect(collection.numItems).toBe(2);
    expect(collection.getItem(key1)?.value).toBe(1);
    expect(collection.getItem(key2)?.value).toBe(2);
  });

  // --- appendItemAt ---
  it('appendItemAt should insert item at specific index', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();

    collection.appendItem({ key: 'x', value: 10 });
    collection.appendItem({ key: 'z', value: 30 });
    collection.appendItemAt({ key: 'y', value: 20 }, 1);

    const keys = [...collection].map((i) => i.key);
    expect(keys).toEqual(['x', 'y', 'z']);
  });

  it('appendItemAt should clamp index to bounds', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();

    collection.appendItem({ key: 'start', value: 1 });
    collection.appendItemAt({ key: 'tooBig', value: 2 }, 100);

    const keys = [...collection].map((i) => i.key);
    expect(keys).toEqual(['start', 'tooBig']);
  });

  // --- prependItem ---
  it('prependItem should add item at the beginning', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();

    collection.appendItem({ key: 'b', value: 2 });
    collection.prependItem({ key: 'a', value: 1 });

    const keys = [...collection].map((i) => i.key);
    expect(keys).toEqual(['a', 'b']);
  });

  it('prependItem should replace item if key exists', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();

    collection.appendItem({ key: 'dup', value: 100 });
    collection.prependItem({ key: 'dup', value: 200 });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem('dup')?.value).toBe(200);
  });

  // --- insertItemBefore ---
  it('insertItemBefore should insert item before existing key', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();

    collection.appendItem({ key: '1', value: 1 });
    collection.appendItem({ key: '3', value: 3 });
    collection.insertItemBefore('3', { key: '2', value: 2 });

    const keys = [...collection].map((i) => i.key);
    expect(keys).toEqual(['1', '2', '3']);
  });

  it('insertItemBefore should append if target key not found', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();

    collection.appendItem({ key: 'only', value: 1 });
    collection.insertItemBefore('missing', { key: 'new', value: 2 });

    const keys = [...collection].map((i) => i.key);
    expect(keys).toEqual(['only', 'new']);
  });

  // --- insertItemAfter ---
  it('insertItemAfter should insert item after existing key', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();

    collection.appendItem({ key: '1', value: 1 });
    collection.appendItem({ key: '3', value: 3 });
    collection.insertItemAfter('1', { key: '2', value: 2 });

    const keys = [...collection].map((i) => i.key);
    expect(keys).toEqual(['1', '2', '3']);
  });

  it('insertItemAfter should append if target key not found', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();

    collection.appendItem({ key: 'only', value: 1 });
    collection.insertItemAfter('missing', { key: 'new', value: 2 });

    const keys = [...collection].map((i) => i.key);
    expect(keys).toEqual(['only', 'new']);
  });

  // --- replaceItem ---
  it('replaceItem should replace existing item', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();

    collection.appendItem({ key: 'a', value: 1 });
    collection.replaceItem('a', { key: 'a', value: 100 });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem('a')?.value).toBe(100);
  });

  it('replaceItem should insert if key not exists', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();

    collection.replaceItem('new', { key: 'new', value: 999 });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem('new')?.value).toBe(999);
  });

  // --- removeItem ---
  it('removeItem should remove item by key', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();

    collection.appendItem({ key: 'x', value: 10 });
    const removed = collection.removeItem('x');

    expect(removed).toBe(true);
    expect(collection.getItem('x')).toBeNull();
    expect(collection.numItems).toBe(0);
  });

  it('removeItem should return false if key not found', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();

    const removed = collection.removeItem('missing');
    expect(removed).toBe(false);
  });

  // --- clear ---
  it('clear should remove all items', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >({
      initialItems: [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
      ],
    });

    collection.clear();
    expect(collection.numItems).toBe(0);
  });

  // --- reset ---
  it('reset should restore initial items', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >({
      initialItems: [{ key: 'init', value: 1 }],
    });

    collection.appendItem({ key: 'other', value: 2 });
    collection.reset();

    expect(collection.numItems).toBe(1);
    expect(collection.getItem('init')?.value).toBe(1);
  });

  // --- setItems ---
  it('setItems should replace all items', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();

    collection.setItems([
      { key: 'new1', value: 100 },
      { key: 'new2', value: 200 },
    ]);

    expect(collection.numItems).toBe(2);
    expect(collection.getItem('new1')?.value).toBe(100);
  });

  it('setItems should clear if empty array given', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >({
      initialItems: [{ key: 'one', value: 1 }],
    });

    collection.setItems([]);
    expect(collection.numItems).toBe(0);
  });

  // --- patchItem ---
  it('patchItem should partially update item', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number; desc?: string }
    >({
      initialItems: [{ key: 'item', value: 123 }],
    });

    const result = collection.patchItem('item', { desc: 'updated' });

    expect(result).toBe(true);
    expect(collection.getItem('item')?.desc).toBe('updated');
  });

  it('patchItem should not patch non-existing item', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();

    const result = collection.patchItem('nope', { value: 999 });
    expect(result).toBe(false);
  });

  it('patchItem should keep primaryKey unchanged', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >({
      initialItems: [{ key: 'stay', value: 1 }],
    });

    collection.patchItem('stay', { value: 777 });

    expect(collection.getItem('stay')?.key).toBe('stay');
    expect(collection.getItem('stay')?.value).toBe(777);
  });
});

describe('Collection events', () => {
  it('appendItem should call update with correct detail', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const handler = vi.fn();
    collection.addEventListener('update', handler);

    collection.appendItem({ key: 'a', value: 1 });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: [{ key: 'a', value: 1 }] }),
    );
  });

  it('prependItem should add item at start', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const handler = vi.fn();
    collection.appendItem({ key: 'b', value: 2 });
    collection.addEventListener('update', handler);

    collection.prependItem({ key: 'a', value: 1 });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(
      expect.objectContaining({
        detail: [
          { key: 'a', value: 1 },
          { key: 'b', value: 2 },
        ],
      }),
    );
  });

  it('appendItemAt should insert at correct index', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const handler = vi.fn();
    collection.appendItem({ key: 'one', value: 1 });
    collection.appendItem({ key: 'three', value: 3 });
    collection.addEventListener('update', handler);

    collection.appendItemAt({ key: 'two', value: 2 }, 1);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(
      expect.objectContaining({
        detail: [
          { key: 'one', value: 1 },
          { key: 'two', value: 2 },
          { key: 'three', value: 3 },
        ],
      }),
    );
  });

  it('insertItemBefore should insert item before target', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const handler = vi.fn();
    collection.appendItem({ key: 'x', value: 1 });
    collection.addEventListener('update', handler);

    collection.insertItemBefore('x', { key: 'before', value: 0 });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(
      expect.objectContaining({
        detail: [
          { key: 'before', value: 0 },
          { key: 'x', value: 1 },
        ],
      }),
    );
  });

  it('insertItemAfter should insert item after target', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const handler = vi.fn();
    collection.appendItem({ key: 'x', value: 1 });
    collection.addEventListener('update', handler);

    collection.insertItemAfter('x', { key: 'after', value: 2 });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(
      expect.objectContaining({
        detail: [
          { key: 'x', value: 1 },
          { key: 'after', value: 2 },
        ],
      }),
    );
  });

  it('replaceItem should update existing item', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >({
      initialItems: [{ key: 'a', value: 10 }],
    });
    const handler = vi.fn();
    collection.addEventListener('update', handler);

    collection.replaceItem('a', { key: 'a', value: 999 });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: [{ key: 'a', value: 999 }] }),
    );
  });

  it('replaceItem (new) should add item', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const handler = vi.fn();
    collection.addEventListener('update', handler);

    collection.replaceItem('new', { key: 'new', value: 555 });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: [{ key: 'new', value: 555 }] }),
    );
  });

  it('removeItem should clear item from detail', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >({
      initialItems: [{ key: 'del', value: 1 }],
    });
    const handler = vi.fn();
    collection.addEventListener('update', handler);

    collection.removeItem('del');

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: [] }),
    );
  });

  it('clear should empty detail', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >({
      initialItems: [{ key: 'some', value: 1 }],
    });
    const handler = vi.fn();
    collection.addEventListener('update', handler);

    collection.clear();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: [] }),
    );
  });

  it('reset should restore initialItems in detail', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >({
      initialItems: [{ key: 'init', value: 1 }],
    });
    const handler = vi.fn();
    collection.appendItem({ key: 'extra', value: 999 });
    collection.addEventListener('update', handler);

    collection.reset();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: [{ key: 'init', value: 1 }] }),
    );
  });

  it('setItems should set new detail', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const handler = vi.fn();
    collection.addEventListener('update', handler);

    collection.setItems([
      { key: 'a', value: 1 },
      { key: 'b', value: 2 },
    ]);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(
      expect.objectContaining({
        detail: [
          { key: 'a', value: 1 },
          { key: 'b', value: 2 },
        ],
      }),
    );
  });

  it('setItems([]) should empty detail', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >({
      initialItems: [{ key: 'exists', value: 10 }],
    });
    const handler = vi.fn();
    collection.addEventListener('update', handler);

    collection.setItems([]);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: [] }),
    );
  });

  it('patchItem should update fields', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number; desc?: string }
    >({
      initialItems: [{ key: 'patch', value: 5 }],
    });
    const handler = vi.fn();
    collection.addEventListener('update', handler);

    collection.patchItem('patch', { desc: 'updated' });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(
      expect.objectContaining({
        detail: [{ key: 'patch', value: 5, desc: 'updated' }],
      }),
    );
  });

  it('patchItem missing should not dispatch event', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const handler = vi.fn();
    collection.addEventListener('update', handler);

    const result = collection.patchItem('missing', { value: 999 });

    expect(result).toBe(false);
    expect(handler).not.toHaveBeenCalled();
  });

  it('insertItemBefore missing key should append', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const handler = vi.fn();
    collection.addEventListener('update', handler);

    collection.insertItemBefore('missing', { key: 'new', value: 5 });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: [{ key: 'new', value: 5 }] }),
    );
  });

  it('insertItemAfter missing key should append', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const handler = vi.fn();
    collection.addEventListener('update', handler);

    collection.insertItemAfter('missing', { key: 'new', value: 5 });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: [{ key: 'new', value: 5 }] }),
    );
  });

  it('reset empty collection should keep detail empty', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const handler = vi.fn();
    collection.addEventListener('update', handler);

    collection.reset();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: [] }),
    );
  });

  it('clear empty collection should keep detail empty', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const handler = vi.fn();
    collection.addEventListener('update', handler);

    collection.clear();

    expect(handler).toHaveBeenCalledTimes(0);
  });
});

describe('Collection events - multiple handlers and stopImmediatePropagation', () => {
  it('should call multiple addEventListener handlers', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    collection.addEventListener('update', handler1);
    collection.addEventListener('update', handler2);

    collection.appendItem({ key: 'x', value: 1 });

    expect(handler1).toHaveBeenCalledOnce();
    expect(handler2).toHaveBeenCalledOnce();
  });

  it('should call both onUpdate and addEventListener handler', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const onUpdateHandler = vi.fn();
    const listenerHandler = vi.fn();

    collection.onUpdate = onUpdateHandler;
    collection.addEventListener('update', listenerHandler);

    collection.appendItem({ key: 'x', value: 1 });

    expect(onUpdateHandler).toHaveBeenCalledOnce();
    expect(listenerHandler).toHaveBeenCalledOnce();
  });

  it('stopImmediatePropagation in onUpdate should prevent addEventListener handlers', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const listenerHandler = vi.fn();

    collection.onUpdate = (event) => {
      event.stopImmediatePropagation();
    };
    collection.addEventListener('update', listenerHandler);

    collection.appendItem({ key: 'x', value: 1 });

    expect(listenerHandler).not.toHaveBeenCalled();
  });

  it('stopImmediatePropagation in first addEventListener should prevent next', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const firstHandler = vi.fn((event: Event) => {
      (event as CollectionUpdateEvent).stopImmediatePropagation();
    });
    const secondHandler = vi.fn();

    collection.addEventListener('update', firstHandler);
    collection.addEventListener('update', secondHandler);

    collection.appendItem({ key: 'x', value: 1 });

    expect(firstHandler).toHaveBeenCalledOnce();
    expect(secondHandler).not.toHaveBeenCalled();
  });

  it('should call handlers in correct order', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const calls: string[] = [];

    collection.addEventListener('update', () => calls.push('first'));
    collection.addEventListener('update', () => calls.push('second'));

    collection.appendItem({ key: 'x', value: 1 });

    expect(calls).toEqual(['first', 'second']);
  });

  it('onUpdate should not block addEventListener if not stopped', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const onUpdateHandler = vi.fn();
    const eventListenerHandler = vi.fn();

    collection.onUpdate = onUpdateHandler;
    collection.addEventListener('update', eventListenerHandler);

    collection.appendItem({ key: 'x', value: 1 });

    expect(onUpdateHandler).toHaveBeenCalledOnce();
    expect(eventListenerHandler).toHaveBeenCalledOnce();
  });

  it('stopImmediatePropagation in onUpdate should not block onUpdate itself', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const onUpdateHandler = vi.fn((event: Event) => {
      (event as CollectionUpdateEvent).stopImmediatePropagation();
    });

    collection.onUpdate = onUpdateHandler;

    collection.appendItem({ key: 'x', value: 1 });

    expect(onUpdateHandler).toHaveBeenCalledOnce();
  });

  it('should dispatch multiple events independently', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const handler = vi.fn();
    collection.addEventListener('update', handler);

    collection.appendItem({ key: 'a', value: 1 });
    collection.appendItem({ key: 'b', value: 2 });

    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('should call new listener after being added dynamically', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; value: number }
    >();
    const handler = vi.fn();

    collection.appendItem({ key: 'first', value: 1 });

    collection.addEventListener('update', handler);
    collection.appendItem({ key: 'second', value: 2 });

    expect(handler).toHaveBeenCalledOnce();
  });
});

describe('Collection with different primaryKeys (fixed)', () => {
  it('should work with primaryKey = string', () => {
    const collection = new Collection<
      'uid',
      string,
      { uid: string; name: string }
    >({
      primaryKey: 'uid',
    });

    collection.appendItem({ uid: 'user-1', name: 'Alice' });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem('user-1')?.name).toBe('Alice');
  });

  it('should work with primaryKey = number', () => {
    const collection = new Collection<
      'id',
      number,
      { id: number; value: number }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 101, value: 42 });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem(101)?.value).toBe(42);
  });

  it('should work with primaryKey = bigint', () => {
    const collection = new Collection<
      'bigId',
      bigint,
      { bigId: bigint; data: string }
    >({
      primaryKey: 'bigId',
    });

    const bigKey = BigInt('9007199254740991');

    collection.appendItem({ bigId: bigKey, data: 'Huge' });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem(bigKey)?.data).toBe('Huge');
  });

  it('should replace item with same string primaryKey', () => {
    const collection = new Collection<
      'slug',
      string,
      { slug: string; title: string }
    >({
      primaryKey: 'slug',
    });

    collection.appendItem({ slug: 'post-1', title: 'First' });
    collection.appendItem({ slug: 'post-1', title: 'Updated First' });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem('post-1')?.title).toBe('Updated First');
  });

  it('should replace item with same number primaryKey', () => {
    const collection = new Collection<
      'id',
      number,
      { id: number; value: number }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 1, value: 123 });
    collection.appendItem({ id: 1, value: 456 });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem(1)?.value).toBe(456);
  });

  it('should replace item with same bigint primaryKey', () => {
    const collection = new Collection<
      'bigId',
      bigint,
      { bigId: bigint; value: string }
    >({
      primaryKey: 'bigId',
    });

    const id = BigInt('12345678901234567890');

    collection.appendItem({ bigId: id, value: 'initial' });
    collection.appendItem({ bigId: id, value: 'updated' });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem(id)?.value).toBe('updated');
  });

  it('should correctly remove item by string key', () => {
    const collection = new Collection<
      'key',
      string,
      { key: string; text: string }
    >({
      primaryKey: 'key',
    });

    collection.appendItem({ key: 'abc', text: 'Test' });
    const removed = collection.removeItem('abc');

    expect(removed).toBe(true);
    expect(collection.getItem('abc')).toBeNull();
    expect(collection.numItems).toBe(0);
  });

  it('should correctly remove item by number key', () => {
    const collection = new Collection<
      'id',
      number,
      { id: number; text: string }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 10, text: 'Number Key' });
    const removed = collection.removeItem(10);

    expect(removed).toBe(true);
    expect(collection.getItem(10)).toBeNull();
    expect(collection.numItems).toBe(0);
  });

  it('should correctly remove item by bigint key', () => {
    const collection = new Collection<
      'uid',
      bigint,
      { uid: bigint; name: string }
    >({
      primaryKey: 'uid',
    });

    const key = BigInt(987654321);
    collection.appendItem({ uid: key, name: 'BigUser' });

    const removed = collection.removeItem(key);

    expect(removed).toBe(true);
    expect(collection.getItem(key)).toBeNull();
    expect(collection.numItems).toBe(0);
  });

  it('should patch item with string key', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; value: number }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 'patch-me', value: 1 });
    collection.patchItem('patch-me', { value: 999 });

    expect(collection.getItem('patch-me')?.value).toBe(999);
  });

  it('should patch item with number key', () => {
    const collection = new Collection<
      'code',
      number,
      { code: number; status: string }
    >({
      primaryKey: 'code',
    });

    collection.appendItem({ code: 404, status: 'Not Found' });
    collection.patchItem(404, { status: 'Found' });

    expect(collection.getItem(404)?.status).toBe('Found');
  });

  it('should patch item with bigint key', () => {
    const collection = new Collection<
      'pk',
      bigint,
      { pk: bigint; info: string }
    >({
      primaryKey: 'pk',
    });

    const key = BigInt(1122334455);
    collection.appendItem({ pk: key, info: 'Old' });
    collection.patchItem(key, { info: 'Updated' });

    expect(collection.getItem(key)?.info).toBe('Updated');
  });

  it('should insert item before/after with string key', () => {
    const collection = new Collection<
      'slug',
      string,
      { slug: string; title: string }
    >({
      primaryKey: 'slug',
    });

    collection.appendItem({ slug: 'first', title: 'First' });
    collection.insertItemAfter('first', { slug: 'second', title: 'Second' });

    const keys = [...collection].map((i) => i.slug);
    expect(keys).toEqual(['first', 'second']);
  });

  it('should insert item before/after with number key', () => {
    const collection = new Collection<
      'num',
      number,
      { num: number; value: string }
    >({
      primaryKey: 'num',
    });

    collection.appendItem({ num: 1, value: 'One' });
    collection.insertItemAfter(1, { num: 2, value: 'Two' });

    const keys = [...collection].map((i) => i.num);
    expect(keys).toEqual([1, 2]);
  });

  it('should insert item before/after with bigint key', () => {
    const collection = new Collection<
      'key',
      bigint,
      { key: bigint; name: string }
    >({
      primaryKey: 'key',
    });

    const k1 = BigInt(100);
    const k2 = BigInt(101);

    collection.appendItem({ key: k1, name: 'First' });
    collection.insertItemAfter(k1, { key: k2, name: 'Second' });

    const keys = [...collection].map((i) => i.key);
    expect(keys).toEqual([k1, k2]);
  });
});

describe('Collection - replacing items with same primaryKey (strict inline types)', () => {
  it('appendItem should replace existing item (string key)', () => {
    const collection = new Collection<
      'slug',
      string,
      { slug: string; title: string }
    >({
      primaryKey: 'slug',
    });

    collection.appendItem({ slug: 'one', title: 'First' });
    collection.appendItem({ slug: 'one', title: 'Updated First' });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem('one')?.title).toBe('Updated First');
  });

  it('prependItem should replace existing item (string key)', () => {
    const collection = new Collection<
      'slug',
      string,
      { slug: string; title: string }
    >({
      primaryKey: 'slug',
    });

    collection.appendItem({ slug: 'one', title: 'First' });
    collection.prependItem({ slug: 'one', title: 'Prepended' });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem('one')?.title).toBe('Prepended');
  });

  it('appendItemAt should replace existing item (string key)', () => {
    const collection = new Collection<
      'slug',
      string,
      { slug: string; title: string }
    >({
      primaryKey: 'slug',
    });

    collection.appendItem({ slug: 'one', title: 'First' });
    collection.appendItemAt({ slug: 'one', title: 'Inserted' }, 0);

    expect(collection.numItems).toBe(1);
    expect(collection.getItem('one')?.title).toBe('Inserted');
  });

  it('insertItemBefore should replace existing item (string key)', () => {
    const collection = new Collection<
      'slug',
      string,
      { slug: string; title: string }
    >({
      primaryKey: 'slug',
    });

    collection.appendItem({ slug: 'one', title: 'First' });
    collection.insertItemBefore('one', { slug: 'one', title: 'Before' });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem('one')?.title).toBe('Before');
  });

  it('insertItemAfter should replace existing item (string key)', () => {
    const collection = new Collection<
      'slug',
      string,
      { slug: string; title: string }
    >({
      primaryKey: 'slug',
    });

    collection.appendItem({ slug: 'one', title: 'First' });
    collection.insertItemAfter('one', { slug: 'one', title: 'After' });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem('one')?.title).toBe('After');
  });

  it('replaceItem should replace existing item (string key)', () => {
    const collection = new Collection<
      'slug',
      string,
      { slug: string; title: string }
    >({
      primaryKey: 'slug',
    });

    collection.appendItem({ slug: 'one', title: 'First' });
    collection.replaceItem('one', { slug: 'one', title: 'Replaced' });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem('one')?.title).toBe('Replaced');
  });

  it('appendItem should replace existing item (number key)', () => {
    const collection = new Collection<
      'id',
      number,
      { id: number; value: string }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 1, value: 'A' });
    collection.appendItem({ id: 1, value: 'B' });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem(1)?.value).toBe('B');
  });

  it('insertItemBefore should replace existing item (number key)', () => {
    const collection = new Collection<
      'id',
      number,
      { id: number; value: string }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 2, value: 'Old' });
    collection.insertItemBefore(2, { id: 2, value: 'New' });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem(2)?.value).toBe('New');
  });

  it('insertItemAfter should replace existing item (number key)', () => {
    const collection = new Collection<
      'id',
      number,
      { id: number; value: string }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 3, value: 'Old' });
    collection.insertItemAfter(3, { id: 3, value: 'New' });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem(3)?.value).toBe('New');
  });

  it('replaceItem should replace existing item (number key)', () => {
    const collection = new Collection<
      'id',
      number,
      { id: number; name: string }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 99, name: 'Old Name' });
    collection.replaceItem(99, { id: 99, name: 'New Name' });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem(99)?.name).toBe('New Name');
  });

  it('appendItem should replace existing item (bigint key)', () => {
    const collection = new Collection<
      'key',
      bigint,
      { key: bigint; info: string }
    >({
      primaryKey: 'key',
    });

    const bigKey = BigInt(1000);

    collection.appendItem({ key: bigKey, info: 'Old Info' });
    collection.appendItem({ key: bigKey, info: 'Updated Info' });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem(bigKey)?.info).toBe('Updated Info');
  });

  it('insertItemBefore should replace existing item (bigint key)', () => {
    const collection = new Collection<
      'key',
      bigint,
      { key: bigint; data: string }
    >({
      primaryKey: 'key',
    });

    const bigKey = BigInt(5555);

    collection.appendItem({ key: bigKey, data: 'Old Data' });
    collection.insertItemBefore(bigKey, { key: bigKey, data: 'New Data' });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem(bigKey)?.data).toBe('New Data');
  });

  it('insertItemAfter should replace existing item (bigint key)', () => {
    const collection = new Collection<
      'key',
      bigint,
      { key: bigint; data: string }
    >({
      primaryKey: 'key',
    });

    const bigKey = BigInt(9999);

    collection.appendItem({ key: bigKey, data: 'Old Version' });
    collection.insertItemAfter(bigKey, { key: bigKey, data: 'New Version' });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem(bigKey)?.data).toBe('New Version');
  });

  it('replaceItem should replace existing item (bigint key)', () => {
    const collection = new Collection<
      'pk',
      bigint,
      { pk: bigint; name: string }
    >({
      primaryKey: 'pk',
    });

    const bigKey = BigInt('1234567890123456789');

    collection.appendItem({ pk: bigKey, name: 'Old Name' });
    collection.replaceItem(bigKey, { pk: bigKey, name: 'Updated Name' });

    expect(collection.numItems).toBe(1);
    expect(collection.getItem(bigKey)?.name).toBe('Updated Name');
  });
});

describe('Collection - removeItem, patchItem, hasItem behavior', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  // --- removeItem tests ---
  it('removeItem should return false if item does not exist (string key)', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; name: string }
    >({
      primaryKey: 'id',
    });

    const result = collection.removeItem('not-exist');

    expect(result).toBe(false);
    expect(collection.numItems).toBe(0);
  });

  it('removeItem should return false if item does not exist (number key)', () => {
    const collection = new Collection<
      'id',
      number,
      { id: number; name: string }
    >({
      primaryKey: 'id',
    });

    const result = collection.removeItem(999);

    expect(result).toBe(false);
    expect(collection.numItems).toBe(0);
  });

  it('removeItem should return false if item does not exist (bigint key)', () => {
    const collection = new Collection<
      'pk',
      bigint,
      { pk: bigint; name: string }
    >({
      primaryKey: 'pk',
    });

    const result = collection.removeItem(BigInt(123456789));

    expect(result).toBe(false);
    expect(collection.numItems).toBe(0);
  });

  // --- patchItem tests ---
  it('patchItem should update existing item (string key)', () => {
    const collection = new Collection<
      'slug',
      string,
      { slug: string; title: string }
    >({
      primaryKey: 'slug',
    });

    collection.appendItem({ slug: 'post-1', title: 'Original' });
    const result = collection.patchItem('post-1', { title: 'Updated' });

    expect(result).toBe(true);
    expect(collection.getItem('post-1')?.title).toBe('Updated');
  });

  it('patchItem should update existing item (number key)', () => {
    const collection = new Collection<
      'id',
      number,
      { id: number; value: string }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 1, value: 'One' });
    const result = collection.patchItem(1, { value: 'Updated One' });

    expect(result).toBe(true);
    expect(collection.getItem(1)?.value).toBe('Updated One');
  });

  it('patchItem should update existing item (bigint key)', () => {
    const collection = new Collection<
      'key',
      bigint,
      { key: bigint; info: string }
    >({
      primaryKey: 'key',
    });

    const key = BigInt(100);
    collection.appendItem({ key, info: 'Before' });
    const result = collection.patchItem(key, { info: 'After' });

    expect(result).toBe(true);
    expect(collection.getItem(key)?.info).toBe('After');
  });

  it('patchItem should return false if item does not exist (string key)', () => {
    const collection = new Collection<
      'slug',
      string,
      { slug: string; title: string }
    >({
      primaryKey: 'slug',
    });

    const result = collection.patchItem('non-existent', {
      title: 'Does not matter',
    });

    expect(result).toBe(false);
  });

  it('patchItem should return false if item does not exist (number key)', () => {
    const collection = new Collection<
      'id',
      number,
      { id: number; name: string }
    >({
      primaryKey: 'id',
    });

    const result = collection.patchItem(123, { name: 'No Name' });

    expect(result).toBe(false);
  });

  it('patchItem should NOT change primaryKey (string key)', () => {
    const collection = new Collection<
      'slug',
      string,
      { slug: string; title: string }
    >({
      primaryKey: 'slug',
    });

    collection.appendItem({ slug: 'initial', title: 'Original' });
    // @ts-expect-error intentionally trying to override primary key for test
    collection.patchItem('initial', { slug: 'new-slug', title: 'Updated' });

    expect(collection.hasItem('initial')).toBe(true);
    expect(collection.getItem('initial')?.title).toBe('Updated');
    expect(collection.hasItem('new-slug')).toBe(false);
  });

  it('patchItem should NOT change primaryKey (number key)', () => {
    const collection = new Collection<
      'id',
      number,
      { id: number; value: string }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 1, value: 'Original' });

    // @ts-expect-error intentionally trying to override primary key for test
    collection.patchItem(1, { id: 999, value: 'Changed' });

    expect(collection.hasItem(1)).toBe(true);
    expect(collection.getItem(1)?.value).toBe('Changed');
    expect(collection.hasItem(999)).toBe(false);
  });

  it('patchItem should NOT change primaryKey (bigint key)', () => {
    const collection = new Collection<
      'pk',
      bigint,
      { pk: bigint; info: string }
    >({
      primaryKey: 'pk',
    });

    const oldKey = BigInt(111);
    const newKey = BigInt(222);

    collection.appendItem({ pk: oldKey, info: 'Old' });

    // @ts-expect-error intentionally trying to override primary key for test
    collection.patchItem(oldKey, { pk: newKey, info: 'New Info' });

    expect(collection.hasItem(oldKey)).toBe(true);
    expect(collection.getItem(oldKey)?.info).toBe('New Info');
    expect(collection.hasItem(newKey)).toBe(false);
  });

  // --- hasItem tests ---
  it('hasItem should return true if item exists', () => {
    const collection = new Collection<
      'slug',
      string,
      { slug: string; title: string }
    >({
      primaryKey: 'slug',
    });

    collection.appendItem({ slug: 'exists', title: 'Hello' });

    expect(collection.hasItem('exists')).toBe(true);
  });

  it('hasItem should return false if item does not exist', () => {
    const collection = new Collection<
      'slug',
      string,
      { slug: string; title: string }
    >({
      primaryKey: 'slug',
    });

    expect(collection.hasItem('missing')).toBe(false);
  });
});

describe('Collection hooks - insert operations', () => {
  it('appendItem should call insert:before and insert:after', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; value: number }
    >({
      primaryKey: 'id',
    });

    const beforeHook = vi.fn(() => true);
    const afterHook = vi.fn(() => true);

    collection[$CollectionHookDispatcherSymbol].register(
      'insert:before',
      beforeHook,
    );
    collection[$CollectionHookDispatcherSymbol].register(
      'insert:after',
      afterHook,
    );

    collection.appendItem({ id: 'a', value: 1 });

    expect(beforeHook).toHaveBeenCalledTimes(1);
    expect(afterHook).toHaveBeenCalledTimes(1);
  });

  it('appendItem should not proceed if insert:before returns false', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; value: number }
    >({
      primaryKey: 'id',
    });

    collection[$CollectionHookDispatcherSymbol].register(
      'insert:before',
      () => false,
    );

    const result = collection.appendItem({ id: 'a', value: 1 });

    expect(result).toBe(false);
    expect(collection.numItems).toBe(0);
  });

  it('appendItem should not call insert:after if insert:before returns false', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; value: number }
    >({
      primaryKey: 'id',
    });

    const afterHook = vi.fn();
    collection[$CollectionHookDispatcherSymbol].register(
      'insert:before',
      () => false,
    );
    collection[$CollectionHookDispatcherSymbol].register(
      'insert:after',
      afterHook,
    );

    collection.appendItem({ id: 'a', value: 1 });

    expect(afterHook).not.toHaveBeenCalled();
  });

  it('appendItemAt should call insert:before and insert:after', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; value: number }
    >({
      primaryKey: 'id',
    });

    const beforeHook = vi.fn(() => true);
    const afterHook = vi.fn(() => true);

    collection[$CollectionHookDispatcherSymbol].register(
      'insert:before',
      beforeHook,
    );
    collection[$CollectionHookDispatcherSymbol].register(
      'insert:after',
      afterHook,
    );

    collection.appendItemAt({ id: 'b', value: 2 }, 0);

    expect(beforeHook).toHaveBeenCalledTimes(1);
    expect(afterHook).toHaveBeenCalledTimes(1);
  });

  it('prependItem should call insert:before and insert:after', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; name: string }
    >({
      primaryKey: 'id',
    });

    const beforeHook = vi.fn(() => true);
    const afterHook = vi.fn(() => true);

    collection[$CollectionHookDispatcherSymbol].register(
      'insert:before',
      beforeHook,
    );
    collection[$CollectionHookDispatcherSymbol].register(
      'insert:after',
      afterHook,
    );

    collection.prependItem({ id: 'start', name: 'zero' });

    expect(beforeHook).toHaveBeenCalledTimes(1);
    expect(afterHook).toHaveBeenCalledTimes(1);
  });

  it('insertItemBefore should call insert:before and insert:after', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; title: string }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 'base', title: 'base' });

    const beforeHook = vi.fn(() => true);
    const afterHook = vi.fn(() => true);

    collection[$CollectionHookDispatcherSymbol].register(
      'insert:before',
      beforeHook,
    );
    collection[$CollectionHookDispatcherSymbol].register(
      'insert:after',
      afterHook,
    );

    collection.insertItemBefore('base', { id: 'before', title: 'before' });

    expect(beforeHook).toHaveBeenCalledTimes(1);
    expect(afterHook).toHaveBeenCalledTimes(1);
  });

  it('insertItemAfter should call insert:before and insert:after', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; text: string }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 'base', text: 'base' });

    const beforeHook = vi.fn(() => true);
    const afterHook = vi.fn(() => true);

    collection[$CollectionHookDispatcherSymbol].register(
      'insert:before',
      beforeHook,
    );
    collection[$CollectionHookDispatcherSymbol].register(
      'insert:after',
      afterHook,
    );

    collection.insertItemAfter('base', { id: 'after', text: 'after' });

    expect(beforeHook).toHaveBeenCalledTimes(1);
    expect(afterHook).toHaveBeenCalledTimes(1);
  });

  it('insertItemBefore should not proceed if insert:before returns false', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; content: string }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 'first', content: 'first' });

    collection[$CollectionHookDispatcherSymbol].register(
      'insert:before',
      () => false,
    );

    const result = collection.insertItemBefore('first', {
      id: 'new',
      content: 'new',
    });

    expect(result).toBe(false);
    expect(collection.numItems).toBe(1); // still only 'first'
  });

  it('insertItemAfter should not proceed if insert:before returns false', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; content: string }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 'first', content: 'first' });

    collection[$CollectionHookDispatcherSymbol].register(
      'insert:before',
      () => false,
    );

    const result = collection.insertItemAfter('first', {
      id: 'new',
      content: 'new',
    });

    expect(result).toBe(false);
    expect(collection.numItems).toBe(1);
  });

  it('appendItem should trigger update event after successful insert', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; value: number }
    >({
      primaryKey: 'id',
    });

    const updateListener = vi.fn();
    collection.addEventListener('update', updateListener);

    collection.appendItem({ id: 'a', value: 123 });

    expect(updateListener).toHaveBeenCalledOnce();
    expect(updateListener).toHaveBeenLastCalledWith(
      expect.objectContaining({
        detail: [{ id: 'a', value: 123 }],
      }),
    );
  });

  it('appendItem should NOT trigger update event if insert:before returns false', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; value: number }
    >({
      primaryKey: 'id',
    });

    const updateListener = vi.fn();
    collection.addEventListener('update', updateListener);

    collection[$CollectionHookDispatcherSymbol].register(
      'insert:before',
      () => false,
    );

    collection.appendItem({ id: 'b', value: 456 });

    expect(updateListener).not.toHaveBeenCalled();
  });
});

describe('Collection hooks - patchItem', () => {
  it('patch:before should be called once during patchItem', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; value: number }
    >({
      primaryKey: 'id',
    });

    const beforeHook = vi.fn(() => true);

    collection.appendItem({ id: 'item1', value: 10 });
    collection[$CollectionHookDispatcherSymbol].register(
      'patch:before',
      beforeHook,
    );

    collection.patchItem('item1', { value: 20 });

    expect(beforeHook).toHaveBeenCalledTimes(1);
  });

  it('patch:after should be called once during patchItem', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; value: number }
    >({
      primaryKey: 'id',
    });

    const afterHook = vi.fn(() => true);

    collection.appendItem({ id: 'item2', value: 100 });
    collection[$CollectionHookDispatcherSymbol].register(
      'patch:after',
      afterHook,
    );

    collection.patchItem('item2', { value: 200 });

    expect(afterHook).toHaveBeenCalledTimes(1);
  });

  it('patch:before should receive correct item data', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; label: string }
    >({
      primaryKey: 'id',
    });

    const beforeHook = vi.fn(() => true);

    collection.appendItem({ id: 'label1', label: 'A' });
    collection[$CollectionHookDispatcherSymbol].register(
      'patch:before',
      beforeHook,
    );

    collection.patchItem('label1', { label: 'B' });

    expect(beforeHook).toHaveBeenLastCalledWith(
      expect.objectContaining({
        item: { id: 'label1', label: 'B' },
        index: 0,
        meta: expect.objectContaining({ primaryKey: 'id' }),
      }),
    );
  });

  it('patch:after should receive correct item data', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; name: string }
    >({
      primaryKey: 'id',
    });

    const afterHook = vi.fn(() => true);

    collection.appendItem({ id: 'user', name: 'Original' });
    collection[$CollectionHookDispatcherSymbol].register(
      'patch:after',
      afterHook,
    );

    collection.patchItem('user', { name: 'Updated' });

    expect(afterHook).toHaveBeenLastCalledWith(
      expect.objectContaining({
        item: { id: 'user', name: 'Updated' },
        index: 0,
        meta: expect.objectContaining({ primaryKey: 'id' }),
      }),
    );
  });

  it('patchItem should NOT call patch:after if patch:before returns false', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; data: string }
    >({
      primaryKey: 'id',
    });

    const afterHook = vi.fn();
    const beforeHook = vi.fn(() => false);

    collection.appendItem({ id: 'doc', data: 'Doc1' });
    collection[$CollectionHookDispatcherSymbol].register(
      'patch:before',
      beforeHook,
    );
    collection[$CollectionHookDispatcherSymbol].register(
      'patch:after',
      afterHook,
    );

    collection.patchItem('doc', { data: 'Doc2' });

    expect(afterHook).not.toHaveBeenCalled();
  });

  it('patchItem should block patching if patch:before returns false', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; tag: string }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 'tag1', tag: 'v1' });

    collection[$CollectionHookDispatcherSymbol].register(
      'patch:before',
      () => false,
    );

    const result = collection.patchItem('tag1', { tag: 'v2' });

    expect(result).toBe(false);
    expect(collection.getItem('tag1')?.tag).toBe('v1');
  });

  it('patchItem should update the item if patch:before returns true', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; title: string }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 'post1', title: 'Old Title' });

    collection[$CollectionHookDispatcherSymbol].register(
      'patch:before',
      () => true,
    );

    const result = collection.patchItem('post1', { title: 'New Title' });

    expect(result).toBe(true);
    expect(collection.getItem('post1')?.title).toBe('New Title');
  });

  it('patch:before should be called before patch happens', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; label: string }
    >({
      primaryKey: 'id',
    });

    const spy = vi.fn(() => {
      expect(collection.getItem('item1')?.label).toBe('old');
      return true;
    });

    collection.appendItem({ id: 'item1', label: 'old' });

    collection[$CollectionHookDispatcherSymbol].register('patch:before', spy);

    collection.patchItem('item1', { label: 'new' });

    expect(spy).toHaveBeenCalledOnce();
  });

  it('patch:after should be called after patch happens', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; label: string }
    >({
      primaryKey: 'id',
    });

    const afterSpy = vi.fn(() => {
      expect(collection.getItem('item2')?.label).toBe('new');
    });

    collection.appendItem({ id: 'item2', label: 'old' });

    collection[$CollectionHookDispatcherSymbol].register(
      'patch:after',
      afterSpy,
    );

    collection.patchItem('item2', { label: 'new' });

    expect(afterSpy).toHaveBeenCalledOnce();
  });

  it('patchItem should not crash if no hooks are registered', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; data: string }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 'naked', data: 'clean' });

    const result = collection.patchItem('naked', { data: 'dirty' });

    expect(result).toBe(true);
    expect(collection.getItem('naked')?.data).toBe('dirty');
  });

  it('patchItem should trigger onUpdate after patch:after', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; name: string }
    >({
      primaryKey: 'id',
    });

    const events: string[] = [];

    collection.appendItem({ id: 'user1', name: 'A' });

    collection[$CollectionHookDispatcherSymbol].register('patch:after', () => {
      events.push('after');
    });

    collection.onUpdate = () => {
      events.push('update');
    };

    collection.patchItem('user1', { name: 'B' });

    expect(events).toEqual(['after', 'update']);
  });

  it('patchItem should NOT trigger onUpdate if patch:before returns false', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; label: string }
    >({
      primaryKey: 'id',
    });

    const onUpdate = vi.fn();

    collection.appendItem({ id: 'doc1', label: 'Old' });
    collection.onUpdate = onUpdate;

    collection[$CollectionHookDispatcherSymbol].register(
      'patch:before',
      () => false,
    );

    collection.patchItem('doc1', { label: 'New' });

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('patchItem should allow mutating item inside patch:after hook', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; status: string }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 'task1', status: 'pending' });

    collection[$CollectionHookDispatcherSymbol].register(
      'patch:after',
      ({ item }) => {
        item.status = 'mutated';
      },
    );

    collection.patchItem('task1', { status: 'patched' });

    expect(collection.getItem('task1')).toEqual({
      id: 'task1',
      status: 'mutated',
    });
  });
});

describe('Collection hooks - removeItem operations', () => {
  it('removeItem should call remove:before and remove:after', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; name: string }
    >({
      primaryKey: 'id',
    });

    const beforeHook = vi.fn(() => true);
    const afterHook = vi.fn(() => true);

    collection.appendItem({ id: 'user1', name: 'John' });

    collection[$CollectionHookDispatcherSymbol].register(
      'remove:before',
      beforeHook,
    );
    collection[$CollectionHookDispatcherSymbol].register(
      'remove:after',
      afterHook,
    );

    collection.removeItem('user1');

    expect(beforeHook).toHaveBeenCalledOnce();
    expect(afterHook).toHaveBeenCalledOnce();
  });

  it('removeItem should NOT proceed if remove:before returns false', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; label: string }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 'label1', label: 'test' });

    collection[$CollectionHookDispatcherSymbol].register(
      'remove:before',
      () => false,
    );

    const result = collection.removeItem('label1');

    expect(result).toBe(false);
    expect(collection.hasItem('label1')).toBe(true);
  });

  it('removeItem should NOT call remove:after if remove:before returns false', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; value: number }
    >({
      primaryKey: 'id',
    });

    const afterHook = vi.fn();

    collection.appendItem({ id: 'val1', value: 42 });

    collection[$CollectionHookDispatcherSymbol].register(
      'remove:before',
      () => false,
    );
    collection[$CollectionHookDispatcherSymbol].register(
      'remove:after',
      afterHook,
    );

    collection.removeItem('val1');

    expect(afterHook).not.toHaveBeenCalled();
  });

  it('removeItem should trigger update event after successful remove', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; text: string }
    >({
      primaryKey: 'id',
    });

    const updateListener = vi.fn();

    collection.appendItem({ id: 'note1', text: 'todo' });
    collection.addEventListener('update', updateListener);

    collection.removeItem('note1');

    expect(updateListener).toHaveBeenCalledOnce();
  });

  it('removeItem should NOT trigger update if remove:before returns false', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; comment: string }
    >({
      primaryKey: 'id',
    });

    const updateListener = vi.fn();

    collection.appendItem({ id: 'c1', comment: 'nice' });
    collection.addEventListener('update', updateListener);

    collection[$CollectionHookDispatcherSymbol].register(
      'remove:before',
      () => false,
    );

    collection.removeItem('c1');

    expect(updateListener).not.toHaveBeenCalled();
  });

  it('remove:before should receive correct hook parameters', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; description: string }
    >({
      primaryKey: 'id',
    });

    const beforeHook = vi.fn(() => true);

    collection.appendItem({ id: 'desc1', description: 'desc' });

    collection[$CollectionHookDispatcherSymbol].register(
      'remove:before',
      beforeHook,
    );

    collection.removeItem('desc1');

    expect(beforeHook).toHaveBeenLastCalledWith(
      expect.objectContaining({
        item: { id: 'desc1', description: 'desc' },
        index: 0,
        meta: expect.objectContaining({ primaryKey: 'id' }),
      }),
    );
  });

  it('remove:after should receive correct hook parameters', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; tag: string }
    >({
      primaryKey: 'id',
    });

    const afterHook = vi.fn(() => true);

    collection.appendItem({ id: 'tag1', tag: 'alpha' });

    collection[$CollectionHookDispatcherSymbol].register(
      'remove:after',
      afterHook,
    );

    collection.removeItem('tag1');

    expect(afterHook).toHaveBeenLastCalledWith(
      expect.objectContaining({
        item: { id: 'tag1', tag: 'alpha' },
        index: 0,
        meta: expect.objectContaining({ primaryKey: 'id' }),
      }),
    );
  });

  it('removeItem should allow mutating item inside remove:before', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; field: string }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 'item1', field: 'initial' });

    collection[$CollectionHookDispatcherSymbol].register(
      'remove:before',
      ({ item }) => {
        item.field = 'mutated';
        return true;
      },
    );

    collection.removeItem('item1');

    // item is gone from collection but mutation did happen before removal
    // (no errors, safe mutation before removal)
    expect(collection.getItem('item1')).toBeNull();
  });

  it('removeItem should call remove:after before update event', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; content: string }
    >({
      primaryKey: 'id',
    });

    const events: string[] = [];

    collection.appendItem({ id: 'page1', content: 'draft' });

    collection[$CollectionHookDispatcherSymbol].register('remove:after', () => {
      events.push('after');
    });

    collection.onUpdate = () => {
      events.push('update');
    };

    collection.removeItem('page1');

    expect(events).toEqual(['after', 'update']);
  });
});

describe('Collection hooks - clear operations', () => {
  it('clear should call clear:before and clear:after', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; data: string }
    >({
      primaryKey: 'id',
    });

    const beforeHook = vi.fn(() => true);
    const afterHook = vi.fn(() => true);

    collection.appendItem({ id: 'd1', data: '1' });

    collection[$CollectionHookDispatcherSymbol].register(
      'clear:before',
      beforeHook,
    );
    collection[$CollectionHookDispatcherSymbol].register(
      'clear:after',
      afterHook,
    );

    collection.clear();

    expect(beforeHook).toHaveBeenCalledOnce();
    expect(afterHook).toHaveBeenCalledOnce();
  });

  it('clear should not proceed if clear:before returns false', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; label: string }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 'l1', label: 'A' });

    collection[$CollectionHookDispatcherSymbol].register(
      'clear:before',
      () => false,
    );

    const result = collection.clear();

    expect(result).toBe(false);
    expect(collection.numItems).toBe(1);
  });

  it('clear should not call clear:after if clear:before returns false', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; name: string }
    >({
      primaryKey: 'id',
    });

    const afterHook = vi.fn();

    collection.appendItem({ id: 'n1', name: 'N' });

    collection[$CollectionHookDispatcherSymbol].register(
      'clear:before',
      () => false,
    );
    collection[$CollectionHookDispatcherSymbol].register(
      'clear:after',
      afterHook,
    );

    collection.clear();

    expect(afterHook).not.toHaveBeenCalled();
  });

  it('clear should trigger update event after successful clear', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; info: string }
    >({
      primaryKey: 'id',
    });

    const updateListener = vi.fn();

    collection.appendItem({ id: 'i1', info: 'I' });
    collection.addEventListener('update', updateListener);

    collection.clear();

    expect(updateListener).toHaveBeenCalledOnce();
  });

  it('clear should NOT trigger update if clear:before returns false', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; title: string }
    >({
      primaryKey: 'id',
    });

    const updateListener = vi.fn();

    collection.appendItem({ id: 't1', title: 'T' });
    collection.addEventListener('update', updateListener);

    collection[$CollectionHookDispatcherSymbol].register(
      'clear:before',
      () => false,
    );

    collection.clear();

    expect(updateListener).not.toHaveBeenCalled();
  });

  it('clear:before should receive correct meta parameter', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; type: string }
    >({
      primaryKey: 'id',
    });

    const beforeHook = vi.fn(() => true);

    collection.appendItem({ id: 'x1', type: 'X' });

    collection[$CollectionHookDispatcherSymbol].register(
      'clear:before',
      beforeHook,
    );

    collection.clear();

    expect(beforeHook).toHaveBeenLastCalledWith(
      expect.objectContaining({
        meta: expect.objectContaining({ primaryKey: 'id' }),
      }),
    );
  });

  it('clear:after should receive correct meta parameter', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; group: string }
    >({
      primaryKey: 'id',
    });

    const afterHook = vi.fn(() => true);

    collection.appendItem({ id: 'g1', group: 'G' });

    collection[$CollectionHookDispatcherSymbol].register(
      'clear:after',
      afterHook,
    );

    collection.clear();

    expect(afterHook).toHaveBeenLastCalledWith(
      expect.objectContaining({
        meta: expect.objectContaining({ primaryKey: 'id' }),
      }),
    );
  });

  it('reset should restore initial items and trigger clear hooks', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; note: string }
    >({
      primaryKey: 'id',
      initialItems: [{ id: 'init1', note: 'Initial' }],
    });

    const beforeHook = vi.fn(() => true);
    const afterHook = vi.fn(() => true);

    collection[$CollectionHookDispatcherSymbol].register(
      'clear:before',
      beforeHook,
    );
    collection[$CollectionHookDispatcherSymbol].register(
      'clear:after',
      afterHook,
    );

    collection.appendItem({ id: 'added', note: 'New' });
    collection.reset();

    expect(beforeHook).toHaveBeenCalled();
    expect(afterHook).toHaveBeenCalled();
    expect(collection.numItems).toBe(1);
    expect(collection.getItem('init1')).not.toBeNull();
  });

  it('setItems should clear existing items first and trigger clear hooks', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; prop: string }
    >({
      primaryKey: 'id',
    });

    const beforeHook = vi.fn(() => true);
    const afterHook = vi.fn(() => true);

    collection.appendItem({ id: 'p1', prop: 'Old' });

    collection[$CollectionHookDispatcherSymbol].register(
      'clear:before',
      beforeHook,
    );
    collection[$CollectionHookDispatcherSymbol].register(
      'clear:after',
      afterHook,
    );

    collection.setItems([
      { id: 'p2', prop: 'New' },
      { id: 'p3', prop: 'Newer' },
    ]);

    expect(beforeHook).toHaveBeenCalled();
    expect(afterHook).toHaveBeenCalled();
    expect(collection.numItems).toBe(2);
    expect(collection.getItem('p2')).not.toBeNull();
    expect(collection.getItem('p3')).not.toBeNull();
  });

  it('reset should NOT restore if clear:before blocks clearing', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; attr: string }
    >({
      primaryKey: 'id',
      initialItems: [{ id: 'start', attr: 'origin' }],
    });

    collection.appendItem({ id: 'temp', attr: 'temporary' });

    collection[$CollectionHookDispatcherSymbol].register(
      'clear:before',
      () => false,
    );

    const result = collection.reset();

    expect(result).toBe(false);
    expect(collection.hasItem('temp')).toBe(true);
  });

  it('setItems should NOT set new items if clear:before blocks clearing', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; asset: string }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 'old1', asset: 'Old Asset' });

    collection[$CollectionHookDispatcherSymbol].register(
      'clear:before',
      () => false,
    );

    const result = collection.setItems([{ id: 'new1', asset: 'New Asset' }]);

    expect(result).toBe(false);
    expect(collection.hasItem('old1')).toBe(true);
    expect(collection.hasItem('new1')).toBe(false);
  });

  it('clear should call update after clear:after hook', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; content: string }
    >({
      primaryKey: 'id',
    });

    const events: string[] = [];

    collection.appendItem({ id: 'doc1', content: 'draft' });

    collection[$CollectionHookDispatcherSymbol].register('clear:after', () => {
      events.push('after');
    });

    collection.onUpdate = () => {
      events.push('update');
    };

    collection.clear();

    expect(events).toEqual(['after', 'update']);
  });
});

describe('Collection hooks - reset and setItems operations', () => {
  it('reset should call clear and insert hooks for initial items', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; label: string }
    >({
      primaryKey: 'id',
      initialItems: [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B' },
      ],
    });

    const clearBeforeHook = vi.fn(() => true);
    const clearAfterHook = vi.fn(() => true);
    const insertBeforeHook = vi.fn(() => true);
    const insertAfterHook = vi.fn(() => true);

    collection[$CollectionHookDispatcherSymbol].register(
      'clear:before',
      clearBeforeHook,
    );
    collection[$CollectionHookDispatcherSymbol].register(
      'clear:after',
      clearAfterHook,
    );
    collection[$CollectionHookDispatcherSymbol].register(
      'insert:before',
      insertBeforeHook,
    );
    collection[$CollectionHookDispatcherSymbol].register(
      'insert:after',
      insertAfterHook,
    );

    collection.appendItem({ id: 'temp', label: 'Temp' });

    collection.reset();

    expect(clearBeforeHook).toHaveBeenCalledOnce();
    expect(clearAfterHook).toHaveBeenCalledOnce();
    expect(insertBeforeHook).toHaveBeenCalledTimes(3);
    expect(insertAfterHook).toHaveBeenCalledTimes(3);
    expect(collection.numItems).toBe(2);
  });

  it('reset should NOT insert initial items if clear:before returns false', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; field: string }
    >({
      primaryKey: 'id',
      initialItems: [{ id: 'init', field: 'Start' }],
    });

    collection.appendItem({ id: 'x', field: 'X' });

    collection[$CollectionHookDispatcherSymbol].register(
      'clear:before',
      () => false,
    );

    const result = collection.reset();

    expect(result).toBe(false);
    expect(collection.hasItem('x')).toBe(true);
    expect(collection.hasItem('init')).toBe(true);
  });

  it('reset should trigger update after insert hooks', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; prop: string }
    >({
      primaryKey: 'id',
      initialItems: [{ id: 'foo', prop: 'bar' }],
    });

    const events: string[] = [];

    collection[$CollectionHookDispatcherSymbol].register('insert:after', () => {
      events.push('after');
    });

    collection.onUpdate = () => {
      events.push('update');
    };

    collection.reset();

    expect(events).toEqual(['after', 'update']);
  });

  it('setItems should call clear and insert hooks for new items', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; type: string }
    >({
      primaryKey: 'id',
    });

    const clearBeforeHook = vi.fn(() => true);
    const clearAfterHook = vi.fn(() => true);
    const insertBeforeHook = vi.fn(() => true);
    const insertAfterHook = vi.fn(() => true);

    collection.appendItem({ id: 'old', type: 'old' });

    collection[$CollectionHookDispatcherSymbol].register(
      'clear:before',
      clearBeforeHook,
    );
    collection[$CollectionHookDispatcherSymbol].register(
      'clear:after',
      clearAfterHook,
    );
    collection[$CollectionHookDispatcherSymbol].register(
      'insert:before',
      insertBeforeHook,
    );
    collection[$CollectionHookDispatcherSymbol].register(
      'insert:after',
      insertAfterHook,
    );

    collection.setItems([
      { id: 'new1', type: 'new' },
      { id: 'new2', type: 'new' },
    ]);

    expect(clearBeforeHook).toHaveBeenCalledOnce();
    expect(clearAfterHook).toHaveBeenCalledOnce();
    expect(insertBeforeHook).toHaveBeenCalledTimes(2);
    expect(insertAfterHook).toHaveBeenCalledTimes(2);
    expect(collection.numItems).toBe(2);
  });

  it('setItems should NOT insert items if clear:before returns false', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; desc: string }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 'existing', desc: 'Exist' });

    collection[$CollectionHookDispatcherSymbol].register(
      'clear:before',
      () => false,
    );

    const result = collection.setItems([{ id: 'new', desc: 'New Desc' }]);

    expect(result).toBe(false);
    expect(collection.hasItem('existing')).toBe(true);
    expect(collection.hasItem('new')).toBe(false);
  });

  it('reset should call insert hooks with correct parameters', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; val: number }
    >({
      primaryKey: 'id',
      initialItems: [{ id: 'num1', val: 123 }],
    });

    const insertBeforeHook = vi.fn(() => true);

    collection[$CollectionHookDispatcherSymbol].register(
      'insert:before',
      insertBeforeHook,
    );

    collection.reset();

    expect(insertBeforeHook).toHaveBeenLastCalledWith(
      expect.objectContaining({
        item: { id: 'num1', val: 123 },
        index: 0,
        meta: expect.objectContaining({ primaryKey: 'id' }),
      }),
    );
  });

  it('setItems should call insert hooks with correct parameters', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; code: string }
    >({
      primaryKey: 'id',
    });

    const insertAfterHook = vi.fn(() => true);

    collection[$CollectionHookDispatcherSymbol].register(
      'insert:after',
      insertAfterHook,
    );

    collection.setItems([{ id: 'c1', code: 'abc' }]);

    expect(insertAfterHook).toHaveBeenLastCalledWith(
      expect.objectContaining({
        item: { id: 'c1', code: 'abc' },
        index: 0,
        meta: expect.objectContaining({ primaryKey: 'id' }),
      }),
    );
  });

  it('reset should not crash with no hooks registered', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; val: number }
    >({
      primaryKey: 'id',
      initialItems: [{ id: 'init', val: 0 }],
    });

    collection.appendItem({ id: 'extra', val: 1 });

    const result = collection.reset();

    expect(result).toBe(true);
    expect(collection.numItems).toBe(1);
    expect(collection.getItem('init')).not.toBeNull();
  });

  it('setItems should not crash with no hooks registered', () => {
    const collection = new Collection<
      'id',
      string,
      { id: string; val: number }
    >({
      primaryKey: 'id',
    });

    collection.appendItem({ id: 'old', val: 5 });

    const result = collection.setItems([{ id: 'new', val: 10 }]);

    expect(result).toBe(true);
    expect(collection.numItems).toBe(1);
    expect(collection.getItem('new')).not.toBeNull();
  });
});

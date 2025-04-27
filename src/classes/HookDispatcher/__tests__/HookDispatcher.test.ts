import { HookDispatcher } from '../HookDispatcher';

type Operation = 'a' | 'b';

type ParamsMap = {
  a: [number];
  b: [string, boolean];
};

describe('HookDispatcher', () => {
  it('returns true when no handlers are registered', () => {
    const dispatcher = new HookDispatcher<Operation, ParamsMap>();
    expect(dispatcher.dispatch('a', 123)).toBe(true);
  });

  it('calls registered handler with correct params', () => {
    const dispatcher = new HookDispatcher<Operation, ParamsMap>();
    const handler = vi.fn();
    dispatcher.register('a', handler);

    dispatcher.dispatch('a', 42);
    expect(handler).toHaveBeenCalledWith(42);
  });

  it('returns false if any handler returns false', () => {
    const dispatcher = new HookDispatcher<Operation, ParamsMap>();
    dispatcher.register('a', () => {});
    dispatcher.register('a', () => false);
    dispatcher.register('a', () => {});

    expect(dispatcher.dispatch('a', 1)).toBe(false);
  });

  it('handlers are called in reverse registration order', () => {
    const dispatcher = new HookDispatcher<'x', { x: [] }>();
    const order: number[] = [];

    dispatcher.register('x', () => {
      order.push(1);
    });
    dispatcher.register('x', () => {
      order.push(2);
    });
    dispatcher.register('x', () => {
      order.push(3);
    });

    dispatcher.dispatch('x');
    expect(order).toEqual([3, 2, 1]);
  });

  it('unregister removes handler and prevents future calls', () => {
    const dispatcher = new HookDispatcher<Operation, ParamsMap>();
    const handler = vi.fn();
    const { unregister } = dispatcher.register('a', handler);

    unregister();
    dispatcher.dispatch('a', 100);
    expect(handler).not.toHaveBeenCalled();
  });

  it('Symbol.dispose works the same as unregister', () => {
    const dispatcher = new HookDispatcher<Operation, ParamsMap>();
    const handler = vi.fn();
    const ref = dispatcher.register('a', handler);

    ref[Symbol.dispose]();
    dispatcher.dispatch('a', 100);
    expect(handler).not.toHaveBeenCalled();
  });

  it('multiple handlers are all called if none return false', () => {
    const dispatcher = new HookDispatcher<Operation, ParamsMap>();
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    dispatcher.register('a', handler1);
    dispatcher.register('a', handler2);

    dispatcher.dispatch('a', 10);
    expect(handler1).toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();
  });

  it('handlers receive parameters correctly for each operation', () => {
    const dispatcher = new HookDispatcher<Operation, ParamsMap>();
    const handlerA = vi.fn();
    const handlerB = vi.fn();

    dispatcher.register('a', handlerA);
    dispatcher.register('b', handlerB);

    dispatcher.dispatch('a', 55);
    dispatcher.dispatch('b', 'yes', true);

    expect(handlerA).toHaveBeenCalledWith(55);
    expect(handlerB).toHaveBeenCalledWith('yes', true);
  });

  it('unregister does nothing if handler not in list', () => {
    const dispatcher = new HookDispatcher<'x', { x: [] }>();
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    dispatcher.register('x', handler1);
    const { unregister } = dispatcher.register('x', handler2);

    unregister(); // removes handler2
    unregister(); // second call — should not throw or break

    dispatcher.dispatch('x');
    expect(handler1).toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
  });

  it('handlers can be registered and unregistered multiple times', () => {
    const dispatcher = new HookDispatcher<'x', { x: [] }>();
    const handler = vi.fn();

    const { unregister } = dispatcher.register('x', handler);
    dispatcher.dispatch('x');
    unregister();

    dispatcher.dispatch('x');
    const ref2 = dispatcher.register('x', handler);
    dispatcher.dispatch('x');
    ref2.unregister();

    dispatcher.dispatch('x');

    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('should automatically unregister handler using `using` and Symbol.dispose', () => {
    const dispatcher = new HookDispatcher<'test', { test: [] }>();
    const handler = vi.fn();

    {
      using _disposer = dispatcher.register('test', handler);

      dispatcher.dispatch('test');
      expect(handler).toHaveBeenCalledTimes(1);
    }

    dispatcher.dispatch('test');
    expect(handler).toHaveBeenCalledTimes(1);
  });
});

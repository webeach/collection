import { HookDispatcherBaseHandler } from './types';

/**
 * A generic dispatcher for registering and invoking handlers for named operations.
 *
 * Handlers are invoked in LIFO order (last registered runs first). If any
 * handler returns `false` from a {@link dispatch} call, the operation is
 * considered cancelled and remaining handlers are skipped.
 *
 * @typeParam OperationType - A union of allowed operation names.
 * @typeParam ParamsTupleMap - A mapping from each operation to its parameter tuple.
 */
export class HookDispatcher<
  OperationType extends string = string,
  ParamsTupleMap extends Record<OperationType, unknown[]> = Record<
    OperationType,
    any[]
  >,
> {
  /** Map from operation name to the list of registered handlers. */
  private readonly handlerMap = new Map<
    OperationType,
    HookDispatcherBaseHandler[]
  >();

  /**
   * Invokes all handlers registered for `operation` with the given `params`.
   *
   * @returns `false` if any handler returned `false` (cancellation);
   * otherwise `true`.
   */
  public dispatch<OperationKey extends OperationType>(
    operation: OperationKey,
    ...params: ParamsTupleMap[OperationKey]
  ) {
    const handlerList = this.handlerMap.get(operation);

    if (!handlerList) {
      return true;
    }

    return handlerList.every((handler) => handler(...params) !== false);
  }

  /**
   * Registers `handler` for `operation`. Handlers are prepended, so the most
   * recently registered handler runs first.
   *
   * @returns An object with `unregister()` and `[Symbol.dispose]` for manual or
   * automatic cleanup (e.g. `using sub = dispatcher.register(...)`).
   */
  public register<
    OperationKey extends OperationType,
    Handler extends (...params: ParamsTupleMap[OperationKey]) => boolean | void,
  >(operation: OperationKey, handler: Handler) {
    let handlerList = this.handlerMap.get(operation);

    if (!handlerList) {
      handlerList = [];
      this.handlerMap.set(operation, handlerList);
    }

    handlerList.unshift(handler);

    const unregister = () => {
      const index = handlerList.indexOf(handler);

      if (index !== -1) {
        handlerList.splice(index, 1);
      }
    };

    return {
      unregister,
      [Symbol.dispose]: unregister,
    };
  }
}

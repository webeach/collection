import { HookDispatcherBaseHandler } from './types';

/**
 * A generic dispatcher for managing and invoking event handlers
 * based on specific operation types.
 *
 * @typeParam OperationType - A union of allowed operation names.
 * @typeParam ParamsTupleMap - A mapping from each operation to its expected parameter tuple.
 */
export class HookDispatcher<
  OperationType extends string = string,
  ParamsTupleMap extends Record<OperationType, unknown[]> = Record<
    OperationType,
    any[]
  >,
> {
  /**
   * Internal map that associates each operation with its list of handlers.
   */
  private readonly handlerMap = new Map<
    OperationType,
    HookDispatcherBaseHandler[]
  >();

  /**
   * Dispatches an operation to all registered handlers.
   *
   * @param operation - The name of the operation to dispatch.
   * @param params - Parameters to pass to the handlers.
   * @returns `true` if all handlers succeed or return void, otherwise `false` if any handler returns `false`.
   */
  public dispatch<OperationTypeKey extends OperationType>(
    operation: OperationTypeKey,
    ...params: ParamsTupleMap[OperationTypeKey]
  ) {
    const handlerList = this.handlerMap.get(operation);

    if (!handlerList) {
      return true;
    }

    return handlerList.every((handler) => handler(...params) !== false);
  }

  /**
   * Registers a new handler for a given operation.
   *
   * @param operation - The operation type the handler is associated with.
   * @param handler - The handler function to register.
   * @returns An object containing an `unregister` method and a `[Symbol.dispose]` method for manual or automatic removal.
   */
  public register<
    OperationKey extends OperationType,
    Handler extends (...params: ParamsTupleMap[OperationKey]) => boolean | void,
  >(operation: OperationKey, handler: Handler) {
    const handlerList = this.handlerMap.get(operation) || [handler];

    if (!this.handlerMap.has(operation)) {
      this.handlerMap.set(operation, handlerList);
    } else {
      handlerList.unshift(handler);
    }

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

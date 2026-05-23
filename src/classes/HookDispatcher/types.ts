/** Base signature for any handler registered with `HookDispatcher`. Returns `false` to cancel the operation, or `void` to continue. */
export type HookDispatcherBaseHandler = (...args: any[]) => boolean | void;

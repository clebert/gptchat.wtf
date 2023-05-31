import type {TypeOf, ZodSchema} from 'zod';

export type Store<
  TValueSchemaMap extends ValueSchemaMap,
  TTransitionsMap extends TransitionsMap<TValueSchemaMap>,
> = {
  readonly get: <TState extends keyof TValueSchemaMap | undefined = undefined>(
    expectedState?: TState,
  ) => TState extends keyof TValueSchemaMap
    ? Snapshot<TValueSchemaMap, TTransitionsMap, TState> | undefined
    : Snapshot<TValueSchemaMap, TTransitionsMap, keyof TValueSchemaMap>;

  readonly subscribe: (
    listener: () => void,
    options?: {readonly signal?: AbortSignal},
  ) => () => void;
};

export type ValueSchemaMap = Readonly<Record<string, ZodSchema<any>>>;

export type TransitionsMap<TValueSchemaMap extends ValueSchemaMap> = Readonly<
  Record<keyof TValueSchemaMap, Readonly<Record<string, keyof TValueSchemaMap>>>
>;

export interface Snapshot<
  TValueSchemaMap extends ValueSchemaMap,
  TTransitionsMap extends TransitionsMap<TValueSchemaMap>,
  TState extends keyof TValueSchemaMap,
> {
  readonly state: TState;
  readonly value: TypeOf<TValueSchemaMap[TState]>;
  readonly actions: InferActions<TValueSchemaMap, TTransitionsMap, TState>;
}

export type InferActions<
  TValueSchemaMap extends ValueSchemaMap,
  TTransitionsMap extends TransitionsMap<TValueSchemaMap>,
  TState extends keyof TValueSchemaMap,
> = {
  readonly [TActionName in keyof TTransitionsMap[TState]]: (
    newValue: TypeOf<TValueSchemaMap[TTransitionsMap[TState][TActionName]]>,
  ) => Snapshot<
    TValueSchemaMap,
    TTransitionsMap,
    TTransitionsMap[TState][TActionName]
  >;
};

export type InferSnapshot<TStore, TState> = TStore extends Store<
  infer TValueSchemaMap,
  infer TTransitionsMap
>
  ? TState extends keyof TValueSchemaMap
    ? Snapshot<TValueSchemaMap, TTransitionsMap, TState>
    : never
  : never;

export interface StoreInit<
  TValueSchemaMap extends ValueSchemaMap,
  TTransitionsMap extends TransitionsMap<TValueSchemaMap>,
  TInitialState extends keyof TValueSchemaMap,
> {
  readonly initialState: TInitialState;
  readonly initialValue: TypeOf<TValueSchemaMap[TInitialState]>;
  readonly valueSchemaMap: TValueSchemaMap;
  readonly transitionsMap: TTransitionsMap;
}

export function createStore<
  const TValueSchemaMap extends ValueSchemaMap,
  const TTransitionsMap extends TransitionsMap<TValueSchemaMap>,
  const TInitialState extends keyof TValueSchemaMap,
>({
  initialState,
  initialValue,
  valueSchemaMap,
  transitionsMap,
}: StoreInit<TValueSchemaMap, TTransitionsMap, TInitialState>): Store<
  TValueSchemaMap,
  TTransitionsMap
> {
  const listeners = new Set<() => void>();

  let actualState: keyof TValueSchemaMap = initialState;
  let actualValue = valueSchemaMap[actualState]!.parse(initialValue);
  let actualVersion = Symbol();
  let actualSnapshot = createSnapshot();
  let notifying = false;

  function createSnapshot(): Snapshot<
    TValueSchemaMap,
    TTransitionsMap,
    keyof TValueSchemaMap
  > {
    const version = actualVersion;

    const actions = new Proxy(
      {},
      {
        get(_, actionName) {
          if (version !== actualVersion) {
            throw new Error(`Outdated snapshot.`);
          }

          const newState =
            typeof actionName === `string`
              ? transitionsMap[actualState]![actionName]
              : undefined;

          if (newState === undefined) {
            throw new Error(`Unknown action.`);
          }

          return (newValue: any) => {
            if (notifying) {
              throw new Error(`Illegal state change.`);
            }

            if (version !== actualVersion) {
              throw new Error(`Outdated snapshot.`);
            }

            actualState = newState;
            actualValue = valueSchemaMap[actualState]!.parse(newValue);
            actualVersion = Symbol();
            actualSnapshot = createSnapshot();
            notifying = true;

            try {
              for (const listener of listeners) {
                listener();
              }
            } finally {
              notifying = false;
            }

            return actualSnapshot;
          };
        },
      },
    ) as any;

    return {
      state: actualState,
      get value() {
        if (version !== actualVersion) {
          throw new Error(`Outdated snapshot.`);
        }

        return actualValue;
      },
      get actions() {
        if (version !== actualVersion) {
          throw new Error(`Outdated snapshot.`);
        }

        return actions;
      },
    };
  }

  return {
    get: (expectedState) => {
      return expectedState === undefined || expectedState === actualState
        ? (actualSnapshot as any) // TODO
        : undefined;
    },
    subscribe(listener, {signal} = {}) {
      listeners.add(listener);

      const unsubscribe = () => {
        signal?.removeEventListener(`abort`, unsubscribe);
        listeners.delete(listener);
      };

      signal?.addEventListener(`abort`, unsubscribe);

      return unsubscribe;
    },
  };
}

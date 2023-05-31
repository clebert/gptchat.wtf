import type {
  Snapshot,
  Store,
  TransitionsMap,
  ValueSchemaMap,
} from './create-store.js';

import * as React from 'react';

export function useStore<
  TValueSchemaMap extends ValueSchemaMap,
  TTransitionsMap extends TransitionsMap<TValueSchemaMap>,
  TExpectedState extends keyof TValueSchemaMap | undefined = undefined,
>(
  store: Store<TValueSchemaMap, TTransitionsMap>,
  expectedState?: TExpectedState,
): TExpectedState extends keyof TValueSchemaMap
  ? Snapshot<TValueSchemaMap, TTransitionsMap, TExpectedState> | undefined
  : Snapshot<TValueSchemaMap, TTransitionsMap, keyof TValueSchemaMap> {
  return React.useSyncExternalStore(store.subscribe, () =>
    store.get(expectedState),
  );
}

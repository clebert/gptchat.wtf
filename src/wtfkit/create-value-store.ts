import {Store} from './store.js';

export interface ValueAccessor<TValue> {
  get value(): TValue | undefined;
  set value(newValue: TValue | undefined);
}

export function createValueStore<const TValue>(
  accessor: ValueAccessor<TValue>,
  initialValue: TValue,
): Store<TValue> {
  const store = new Store(accessor.value ?? initialValue, {
    onDispose: () => {
      accessor.value = undefined;
    },
  });

  store.subscribe(() => {
    accessor.value = store.get();
  });

  return store;
}

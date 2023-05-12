import type {ZodType} from 'zod';

import {Store} from './store.js';
import {createStorageItem} from '../utils/create-storage-item.js';

export function createPersistentStore<TValue>(
  key: string,
  schema: ZodType<TValue>,
  initialValue: TValue,
): Store<TValue> {
  const storageItem = createStorageItem(key, schema);

  const store = new Store(storageItem.value ?? initialValue);

  store.subscribe(() => {
    storageItem.value = store.get();
  });

  return store;
}

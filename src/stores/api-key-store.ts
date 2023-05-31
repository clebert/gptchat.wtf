import {createJsonStorageItem} from '../wtfkit/create-json-storage-item.js';
import {createStore} from '../wtfkit/create-store.js';
import * as zod from 'zod';

const storageItem = createJsonStorageItem(`api_key`, zod.string());

export const apiKeyStore = createStore({
  initialState: `current`,
  initialValue: storageItem.value ?? ``,
  valueSchemaMap: {current: zod.string()},
  transitionsMap: {current: {set: `current`}},
});

apiKeyStore.subscribe(() => {
  storageItem.value = apiKeyStore.get().value;
});

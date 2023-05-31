import {createJsonStorageItem} from '../wtfkit/create-json-storage-item.js';
import {createStore} from '../wtfkit/create-store.js';
import * as zod from 'zod';

const storageItem = createJsonStorageItem(
  `model`,
  zod.literal(`gpt-4`).or(zod.literal(`gpt-3.5-turbo`)),
);

export const modelStore = createStore({
  initialState: storageItem.value ?? `gpt-4`,
  initialValue: undefined,
  valueSchemaMap: {
    'gpt-4': zod.void(),
    'gpt-3.5-turbo': zod.void(),
  },
  transitionsMap: {
    'gpt-4': {toggle: `gpt-3.5-turbo`},
    'gpt-3.5-turbo': {toggle: `gpt-4`},
  },
});

modelStore.subscribe(() => {
  storageItem.value = modelStore.get().state;
});

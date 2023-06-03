import {createJsonStorageItem} from '../wtfkit/create-json-storage-item.js';
import {createStore} from 'state-guard';
import * as z from 'zod';

const storageItem = createJsonStorageItem(
  `model`,
  z.literal(`gpt-4`).or(z.literal(`gpt-3.5-turbo`)),
);

export const modelStore = createStore({
  initialState: storageItem.value ?? `gpt-4`,
  initialValue: undefined,
  valueSchemaMap: {
    'gpt-4': z.void(),
    'gpt-3.5-turbo': z.void(),
  },
  transitionsMap: {
    'gpt-4': {toggle: `gpt-3.5-turbo`},
    'gpt-3.5-turbo': {toggle: `gpt-4`},
  },
});

modelStore.subscribe(() => {
  storageItem.value = modelStore.get().state;
});

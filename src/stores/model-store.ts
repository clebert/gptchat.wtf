import {createJsonStorageItem} from '../utils/create-json-storage-item.js';
import {createStateMachine} from 'state-guard';
import {z} from 'zod';

const storageItem = createJsonStorageItem(
  `model`,
  z.literal(`gpt-4`).or(z.literal(`gpt-3.5-turbo`)),
);

export const modelStore = createStateMachine({
  initialState: storageItem.value ?? `gpt-4`,
  initialValue: undefined,
  transformerMap: {
    'gpt-4': () => undefined,
    'gpt-3.5-turbo': () => undefined,
  },
  transitionsMap: {
    'gpt-4': {toggle: `gpt-3.5-turbo`},
    'gpt-3.5-turbo': {toggle: `gpt-4`},
  },
});

modelStore.subscribe(() => {
  storageItem.value = modelStore.get().state;
});

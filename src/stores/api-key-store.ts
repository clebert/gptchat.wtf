import {createJsonStorageItem} from '../utils/create-json-storage-item.js';
import {createStateMachine} from 'state-guard';
import {z} from 'zod';

const storageItem = createJsonStorageItem(`api_key`, z.string());

export const apiKeyStore = createStateMachine({
  initialState: `current`,
  initialValue: storageItem.value ?? ``,
  transformerMap: {current: (apiKey: string) => apiKey},
  transitionsMap: {current: {set: `current`}},
});

apiKeyStore.subscribe(() => {
  storageItem.value = apiKeyStore.get().value;
});

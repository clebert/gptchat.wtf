import {createJsonStorageItem} from '../utils/create-json-storage-item.js';
import {createStateMachine} from 'state-guard';
import {z} from 'zod';

const storageItem = createJsonStorageItem(`apiKey`, z.string());

export const apiKeyMachine = createStateMachine({
  initialState: `isInitialized`,
  initialValue: storageItem.value ?? ``,
  transformerMap: {isInitialized: (value: string) => value},
  transitionsMap: {isInitialized: {initialize: `isInitialized`}},
});

apiKeyMachine.subscribe(() => {
  const {value} = apiKeyMachine.get();

  storageItem.value = value || undefined;
});

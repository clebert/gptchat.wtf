import {createMachine} from 'state-guard';
import {createJsonStorageItem} from 'wtfkit';
import {z} from 'zod';

const storageItem = createJsonStorageItem(`apiKey`, z.string());

export const apiKeyMachine = createMachine({
  initialState: `isInitialized`,
  initialValue: storageItem.value ?? ``,
  transformerMap: {isInitialized: (value: string) => value},
  transitionsMap: {isInitialized: {initialize: `isInitialized`}},
});

apiKeyMachine.subscribe(() => {
  const {value} = apiKeyMachine.get();

  storageItem.value = value || undefined;
});

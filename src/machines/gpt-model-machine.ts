import {createMachine} from 'state-guard';
import {createJsonStorageItem} from 'wtfkit';
import {z} from 'zod';

const storageItem = createJsonStorageItem(`gptModel`, z.literal(`isGpt35Turbo`));

export const gptModelMachine = createMachine({
  initialState: storageItem.value ?? `isGpt4`,
  initialValue: undefined,
  transformerMap: {
    isGpt4: () => undefined,
    isGpt35Turbo: () => undefined,
  },
  transitionsMap: {
    isGpt4: {toggle: `isGpt35Turbo`},
    isGpt35Turbo: {toggle: `isGpt4`},
  },
});

gptModelMachine.subscribe(() => {
  const {state} = gptModelMachine.get();

  storageItem.value = state === `isGpt4` ? undefined : state;
});

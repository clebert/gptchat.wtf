import {createJsonStorageItem} from '../utils/create-json-storage-item.js';
import {createMachine} from 'state-guard';
import {z} from 'zod';

const storageItem = createJsonStorageItem(
  `colorScheme`,
  z.literal(`isLight`).or(z.literal(`isDark`)),
);

export const colorSchemeMachine = createMachine({
  initialState: storageItem.value ?? `isAuto`,
  initialValue: undefined,
  transformerMap: {
    isAuto: () => undefined,
    isLight: () => undefined,
    isDark: () => undefined,
  },
  transitionsMap: {
    isAuto: {toggle: `isLight`},
    isLight: {toggle: `isDark`},
    isDark: {toggle: `isAuto`},
  },
});

colorSchemeMachine.subscribe(() => {
  const {state} = colorSchemeMachine.get();

  storageItem.value = state === `isAuto` ? undefined : state;
});

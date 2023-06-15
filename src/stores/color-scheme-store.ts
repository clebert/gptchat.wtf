import {createJsonStorageItem} from '../utils/create-json-storage-item.js';
import {createStateMachine} from 'state-guard';
import {z} from 'zod';

const storageItem = createJsonStorageItem(
  `color_scheme`,
  z.union([z.literal(`auto`), z.literal(`light`), z.literal(`dark`)]),
);

export const colorSchemeStore = createStateMachine({
  initialState: storageItem.value ?? `auto`,
  initialValue: undefined,
  transformerMap: {
    auto: () => undefined,
    light: () => undefined,
    dark: () => undefined,
  },
  transitionsMap: {
    auto: {toggle: `light`},
    light: {toggle: `dark`},
    dark: {toggle: `auto`},
  },
});

colorSchemeStore.subscribe(() => {
  storageItem.value = colorSchemeStore.get().state;
});

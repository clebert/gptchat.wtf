import {createJsonStorageItem} from '../wtfkit/create-json-storage-item.js';
import {createStore} from '../wtfkit/create-store.js';
import * as z from 'zod';

const storageItem = createJsonStorageItem(
  `color_scheme`,
  z.union([z.literal(`auto`), z.literal(`light`), z.literal(`dark`)]),
);

export const colorSchemeStore = createStore({
  initialState: storageItem.value ?? `auto`,
  initialValue: undefined,
  valueSchemaMap: {
    auto: z.void(),
    light: z.void(),
    dark: z.void(),
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

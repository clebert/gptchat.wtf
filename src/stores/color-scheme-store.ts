import {createJsonStorageItem} from '../wtfkit/create-json-storage-item.js';
import {createStore} from '../wtfkit/create-store.js';
import * as zod from 'zod';

const storageItem = createJsonStorageItem(
  `color_scheme`,
  zod.union([zod.literal(`auto`), zod.literal(`light`), zod.literal(`dark`)]),
);

export const colorSchemeStore = createStore({
  initialState: storageItem.value ?? `auto`,
  initialValue: undefined,
  valueSchemaMap: {
    auto: zod.void(),
    light: zod.void(),
    dark: zod.void(),
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

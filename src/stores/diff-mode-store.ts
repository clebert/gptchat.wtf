import {createJsonStorageItem} from '../wtfkit/create-json-storage-item.js';
import {createStore} from '../wtfkit/create-store.js';
import * as zod from 'zod';

const storageItem = createJsonStorageItem(
  `diff_mode`,
  zod.literal(`off`).or(zod.literal(`on`)),
);

export const diffModeStore = createStore({
  initialState: storageItem.value ?? `off`,
  initialValue: undefined,
  valueSchemaMap: {
    off: zod.void(),
    on: zod.void(),
  },
  transitionsMap: {
    off: {toggle: `on`},
    on: {toggle: `off`},
  },
});

diffModeStore.subscribe(() => {
  storageItem.value = diffModeStore.get().state;
});

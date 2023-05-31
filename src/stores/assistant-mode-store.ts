import {createJsonStorageItem} from '../wtfkit/create-json-storage-item.js';
import {createStore} from '../wtfkit/create-store.js';
import * as zod from 'zod';

const storageItem = createJsonStorageItem(
  `assistant_mode`,
  zod.literal(`general`).or(zod.literal(`programming`)),
);

export const assistantModeStore = createStore({
  initialState: storageItem.value ?? `general`,
  initialValue: undefined,
  valueSchemaMap: {
    general: zod.void(),
    programming: zod.void(),
  },
  transitionsMap: {
    general: {toggle: `programming`},
    programming: {toggle: `general`},
  },
});

assistantModeStore.subscribe(() => {
  storageItem.value = assistantModeStore.get().state;
});

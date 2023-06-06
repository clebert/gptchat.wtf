import {createJsonStorageItem} from '../utils/create-json-storage-item.js';
import {createStore} from 'state-guard';
import {z} from 'zod';

const storageItem = createJsonStorageItem(
  `assistant_mode`,
  z.literal(`general`).or(z.literal(`programming`)),
);

export const assistantModeStore = createStore({
  initialState: storageItem.value ?? `general`,
  initialValue: undefined,
  valueSchemaMap: {
    general: z.void(),
    programming: z.void(),
  },
  transitionsMap: {
    general: {toggle: `programming`},
    programming: {toggle: `general`},
  },
});

assistantModeStore.subscribe(() => {
  storageItem.value = assistantModeStore.get().state;
});

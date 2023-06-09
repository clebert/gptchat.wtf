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
  transformerMap: {
    general: () => undefined,
    programming: () => undefined,
  },
  transitionsMap: {
    general: {toggle: `programming`},
    programming: {toggle: `general`},
  },
});

assistantModeStore.subscribe(() => {
  storageItem.value = assistantModeStore.get().state;
});

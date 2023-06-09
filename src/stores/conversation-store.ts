import {createJsonStorageItem} from '../utils/create-json-storage-item.js';
import {createStore} from 'state-guard';
import {z} from 'zod';

const storageItem = createJsonStorageItem(
  `conversation`,
  z.object({messageIds: z.array(z.string())}),
);

export const conversationStore = createStore({
  initialState: `current`,
  initialValue: storageItem.value ?? {messageIds: []},
  transformerMap: {
    current: (conversation: {readonly messageIds: string[]}) => conversation,
  },
  transitionsMap: {
    current: {set: `current`},
  },
});

conversationStore.subscribe(() => {
  storageItem.value = conversationStore.get().value;
});

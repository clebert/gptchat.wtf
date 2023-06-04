import {createJsonStorageItem} from '../wtfkit/create-json-storage-item.js';
import {createStore} from 'state-guard';
import {z} from 'zod';

const valueSchema = z.object({messageIds: z.array(z.string())}).strict();
const storageItem = createJsonStorageItem(`conversation`, valueSchema);

export const conversationStore = createStore({
  initialState: `current`,
  initialValue: storageItem.value ?? {messageIds: []},
  valueSchemaMap: {current: valueSchema},
  transitionsMap: {current: {set: `current`}},
});

conversationStore.subscribe(() => {
  storageItem.value = conversationStore.get().value;
});

import {createJsonStorageItem} from '../wtfkit/create-json-storage-item.js';
import {createStore} from '../wtfkit/create-store.js';
import * as zod from 'zod';

const valueSchema = zod.object({messageIds: zod.array(zod.string())});
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

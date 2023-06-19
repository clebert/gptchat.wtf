import {createJsonStorageItem} from '../utils/create-json-storage-item.js';
import {createStateMachine} from 'state-guard';
import {z} from 'zod';

export type Message = z.TypeOf<typeof messageSchema>;

const messageSchema = z.object({
  messageId: z.string().uuid(),
  role: z.literal(`assistant`).or(z.literal(`system`)).or(z.literal(`user`)),
  content: z.string(),
});

const storageItem = createJsonStorageItem<readonly Message[]>(`messages`, z.array(messageSchema));

export const messagesMachine = createStateMachine({
  initialState: `isInitialized`,
  initialValue: storageItem.value ?? [],
  transformerMap: {isInitialized: (value: readonly Message[]) => value},
  transitionsMap: {isInitialized: {initialize: `isInitialized`}},
});

messagesMachine.subscribe(() => {
  const {value} = messagesMachine.get();

  storageItem.value = value.length > 0 ? value : undefined;
});

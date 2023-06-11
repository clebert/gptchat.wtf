import {createJsonStorageItem} from '../utils/create-json-storage-item.js';
import {createStore} from 'state-guard';
import {z} from 'zod';

export type Message = Readonly<z.TypeOf<typeof messageSchema>>;

const messageSchema = z.object({
  messageId: z.string().uuid(),
  role: z.literal(`user`).or(z.literal(`assistant`)),
  content: z.string(),
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createConversationStore(conversationId: string) {
  const storageItem = createJsonStorageItem(
    `conversation_${conversationId}`,
    z.object({messages: z.array(messageSchema)}),
  );

  const store = createStore({
    initialState: `current`,
    initialValue: storageItem.value ?? {messages: []},
    transformerMap: {
      current: (
        messages: readonly Message[],
      ): {readonly messages: readonly Message[]} => ({
        messages,
      }),
    },
    transitionsMap: {current: {setMessages: `current`}},
  });

  store.subscribe(() => {
    const {
      value: {messages},
    } = store.get();

    storageItem.value =
      messages.length > 0 ? {messages: [...messages]} : undefined;
  });

  return store;
}

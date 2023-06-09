import type {Store} from 'state-guard';

import {createJsonStorageItem} from '../utils/create-json-storage-item.js';
import {createStore} from 'state-guard';
import {z} from 'zod';

export type MessageStore = Store<
  {readonly current: (message: Message) => Message},
  {readonly current: {readonly set: 'current'}}
>;

export interface Message {
  readonly role: 'user' | 'assistant';
  readonly content: string;
}

const messageStores = new Map<string, MessageStore>();
const abortControllers = new Map<string, AbortController>();

export const messageStoreRegistry = {
  get(messageId: string): MessageStore {
    let messageStore = messageStores.get(messageId);

    if (!messageStore) {
      const abortController = new AbortController();

      messageStores.set(
        messageId,
        (messageStore = createMessageStore(messageId, abortController.signal)),
      );

      abortControllers.set(messageId, abortController);
    }

    return messageStore;
  },
  dispose(messageId: string): void {
    messageStores.delete(messageId);
    abortControllers.get(messageId)?.abort();
    abortControllers.delete(messageId);
  },
};

function createMessageStore(
  messageId: string,
  signal: AbortSignal,
): MessageStore {
  const storageItem = createJsonStorageItem(
    `message:${messageId}`,
    z.object({
      role: z.literal(`user`).or(z.literal(`assistant`)),
      content: z.string(),
    }),
  );

  const store = createStore({
    initialState: `current`,
    initialValue: storageItem.value ?? {role: `user`, content: ``},
    transformerMap: {current: (message: Message) => message},
    transitionsMap: {current: {set: `current`}},
  });

  store.subscribe(
    () => {
      storageItem.value = store.get().value;
    },
    {signal},
  );

  signal.addEventListener(
    `abort`,
    () => {
      storageItem.value = undefined;
    },
    {once: true},
  );

  return store;
}

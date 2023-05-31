import type {Message} from '../stores/create-message-store.js';
import type {Store} from '../wtfkit/store.js';

import {createMessageStore} from '../stores/create-message-store.js';
import * as React from 'react';

export interface App {
  getMessageStore(messageId: string): Store<Message>;
  disposeMessageStore(messageId: string): void;
}

const messageStores = new Map<string, Store<Message>>();

export const AppContext = React.createContext<App>({
  getMessageStore(messageId: string): Store<Message> {
    let messageStore = messageStores.get(messageId);

    if (!messageStore) {
      messageStores.set(
        messageId,
        (messageStore = createMessageStore(messageId)),
      );
    }

    return messageStore;
  },

  disposeMessageStore(messageId: string): void {
    const messageStore = messageStores.get(messageId);

    if (messageStore) {
      messageStores.delete(messageId);
      messageStore.dispose();
    }
  },
});

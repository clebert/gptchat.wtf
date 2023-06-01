import {apiKeyStore} from '../stores/api-key-store.js';
import {conversationStore} from '../stores/conversation-store.js';
import {messageStoreRegistry} from '../stores/message-store-registry.js';
import * as React from 'react';

export function useClearDataCallback(): any {
  return React.useCallback(() => {
    apiKeyStore.get().actions.set(``);

    const conversationSnapshot = conversationStore.get();
    const {messageIds} = conversationSnapshot.value;

    conversationSnapshot.actions.set({messageIds: []});

    for (const messageId of messageIds) {
      messageStoreRegistry.dispose(messageId);
    }
  }, []);
}

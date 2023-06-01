import {conversationStore} from '../stores/conversation-store.js';
import {messageStoreRegistry} from '../stores/message-store-registry.js';
import * as React from 'react';

export function useAddMessageCallback(): (
  role: 'user' | 'assistant',
  content: string,
) => void {
  return React.useCallback((role, content) => {
    const messageId = crypto.randomUUID();
    const messageStore = messageStoreRegistry.get(messageId);

    messageStore.get().actions.set({role, content});

    const conversationSnapshot = conversationStore.get();

    conversationSnapshot.actions.set({
      messageIds: [...conversationSnapshot.value.messageIds, messageId],
    });
  }, []);
}

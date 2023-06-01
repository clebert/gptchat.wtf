import {conversationStore} from '../stores/conversation-store.js';
import {messageStoreRegistry} from '../stores/message-store-registry.js';
import * as React from 'react';

export function useDeleteMessageCallback(): (messageId: string) => void {
  return React.useCallback((messageId) => {
    const conversationSnapshot = conversationStore.get();

    conversationSnapshot.actions.set({
      ...conversationSnapshot,
      messageIds: conversationSnapshot.value.messageIds.filter(
        (otherMessageId) => otherMessageId !== messageId,
      ),
    });

    messageStoreRegistry.dispose(messageId);
  }, []);
}

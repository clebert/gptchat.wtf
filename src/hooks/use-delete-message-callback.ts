import {conversationStore} from '../stores/conversation-store.js';
import * as React from 'react';

export function useDeleteMessageCallback(): (messageId: string) => void {
  return React.useCallback((messageId) => {
    const conversationSnapshot = conversationStore.get();

    conversationSnapshot.actions.setMessages(
      conversationSnapshot.value.messages.filter(
        (otherMessage) => otherMessage.messageId !== messageId,
      ),
    );
  }, []);
}

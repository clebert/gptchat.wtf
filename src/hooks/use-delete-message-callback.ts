import {AppContext} from '../contexts/app-context.js';
import {conversationStore} from '../stores/conversation-store.js';
import * as React from 'react';

export function useDeleteMessageCallback(): (messageId: string) => void {
  const {disposeMessageStore} = React.useContext(AppContext);

  return React.useCallback((messageId) => {
    const conversation = conversationStore.get();

    conversation.actions.set({
      ...conversation,
      messageIds: conversation.value.messageIds.filter(
        (otherMessageId) => otherMessageId !== messageId,
      ),
    });

    disposeMessageStore(messageId);
  }, []);
}

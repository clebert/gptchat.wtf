import {AppContext} from '../contexts/app-context.js';
import * as React from 'react';

export function useDeleteMessageCallback(): (messageId: string) => void {
  const {conversationStore, disposeMessageStore} = React.useContext(AppContext);

  return React.useCallback((messageId) => {
    const conversation = conversationStore.get();

    conversationStore.set({
      ...conversation,
      messageIds: conversation.messageIds.filter(
        (otherMessageId) => otherMessageId !== messageId,
      ),
    });

    disposeMessageStore(messageId);
  }, []);
}

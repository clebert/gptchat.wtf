import {AppContext} from '../contexts/app-context.js';
import {conversationStore} from '../stores/conversation-store.js';
import * as React from 'react';

export function useAddMessageCallback(): (
  role: 'user' | 'assistant',
  content: string,
) => void {
  const {getMessageStore} = React.useContext(AppContext);

  return React.useCallback((role, content) => {
    const messageId = crypto.randomUUID();
    const messageStore = getMessageStore(messageId);

    messageStore.set({...messageStore.get(), role});
    messageStore.get().model.setValue(content);

    const conversation = conversationStore.get();

    conversation.actions.set({
      messageIds: [...conversation.value.messageIds, messageId],
    });
  }, []);
}

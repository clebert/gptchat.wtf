import {conversationStore} from '../stores/conversation-store.js';
import * as React from 'react';

export function useAddMessageCallback(): (
  role: 'user' | 'assistant',
  content: string,
) => void {
  return React.useCallback((role, content) => {
    const conversationSnapshot = conversationStore.get();

    conversationSnapshot.actions.setMessages([
      ...conversationSnapshot.value.messages,
      {messageId: crypto.randomUUID(), role, content},
    ]);
  }, []);
}

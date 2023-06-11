import {apiKeyStore} from '../stores/api-key-store.js';
import {conversationStore} from '../stores/conversation-store.js';
import * as React from 'react';

export function useClearDataCallback(): any {
  return React.useCallback(() => {
    apiKeyStore.get().actions.set(``);
    conversationStore.get().actions.setMessages([]);
  }, []);
}

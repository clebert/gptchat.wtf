import {AppContext} from '../contexts/app-context.js';
import {apiKeyStore} from '../stores/api-key-store.js';
import {conversationStore} from '../stores/conversation-store.js';
import * as React from 'react';

export function useClearDataCallback(): any {
  const {disposeMessageStore} = React.useContext(AppContext);

  return React.useCallback(() => {
    apiKeyStore.get().actions.set(``);

    const conversation = conversationStore.get();
    const {messageIds} = conversation.value;

    conversation.actions.set({messageIds: []});

    for (const messageId of messageIds) {
      disposeMessageStore(messageId);
    }
  }, []);
}

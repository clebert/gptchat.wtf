import {AppContext} from '../contexts/app-context.js';
import {apiKeyStore} from '../stores/api-key-store.js';
import {conversationStore} from '../stores/conversation-store.js';
import * as React from 'react';

export function useClearDataCallback(): any {
  const {disposeMessageStore} = React.useContext(AppContext);

  return React.useCallback(() => {
    apiKeyStore.get().actions.set(``);

    const conversationSnapshot = conversationStore.get();
    const {messageIds} = conversationSnapshot.value;

    conversationSnapshot.actions.set({messageIds: []});

    for (const messageId of messageIds) {
      disposeMessageStore(messageId);
    }
  }, []);
}

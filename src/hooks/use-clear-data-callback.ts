import {AppContext} from '../contexts/app-context.js';
import * as React from 'react';

export function useClearDataCallback(): any {
  const {apiKeyStore, conversationStore, disposeMessageStore} =
    React.useContext(AppContext);

  return React.useCallback(() => {
    apiKeyStore.set(``);

    const {messageIds} = conversationStore.get();

    conversationStore.set({messageIds: []});

    for (const messageId of messageIds) {
      disposeMessageStore(messageId);
    }
  }, []);
}

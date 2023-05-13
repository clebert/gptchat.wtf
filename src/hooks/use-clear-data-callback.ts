import {AppContext} from '../contexts/app-context.js';
import {useCallback, useContext} from 'preact/hooks';

export function useClearDataCallback(): any {
  const {apiKeyStore, conversationStore, disposeMessageStore} =
    useContext(AppContext);

  return useCallback(() => {
    apiKeyStore.set(``);

    const {messageIds} = conversationStore.get();

    conversationStore.set({messageIds: []});

    for (const messageId of messageIds) {
      disposeMessageStore(messageId);
    }
  }, []);
}

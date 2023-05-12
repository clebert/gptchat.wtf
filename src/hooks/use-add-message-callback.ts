import {AppContext} from '../contexts/app-context.js';
import {useCallback, useContext} from 'preact/hooks';

export function useAddMessageCallback(): (
  role: 'user' | 'assistant',
  content: string,
) => void {
  const {conversationStore, getMessageStore} = useContext(AppContext);

  return useCallback((role, content) => {
    const messageId = crypto.randomUUID();
    const messageStore = getMessageStore(messageId);

    messageStore.set({...messageStore.get(), role});
    messageStore.get().model.setValue(content);

    conversationStore.set({
      messageIds: [...conversationStore.get().messageIds, messageId],
    });
  }, []);
}

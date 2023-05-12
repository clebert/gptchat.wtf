import {AppContext} from '../contexts/app-context.js';
import {useCallback, useContext} from 'preact/hooks';

export function useDeleteMessageCallback(): (id: string) => void {
  const {conversationStore, disposeMessageStore} = useContext(AppContext);

  return useCallback((id) => {
    const conversation = conversationStore.get();

    conversationStore.set({
      ...conversation,
      messageIds: conversation.messageIds.filter((otherId) => otherId !== id),
    });

    disposeMessageStore(id);
  }, []);
}

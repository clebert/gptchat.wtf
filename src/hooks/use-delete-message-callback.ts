import {AppContext} from '../contexts/app-context.js';
import * as React from 'react';

export function useDeleteMessageCallback(): (id: string) => void {
  const {conversationStore, disposeMessageStore} = React.useContext(AppContext);

  return React.useCallback((id) => {
    const conversation = conversationStore.get();

    conversationStore.set({
      ...conversation,
      messageIds: conversation.messageIds.filter((otherId) => otherId !== id),
    });

    disposeMessageStore(id);
  }, []);
}

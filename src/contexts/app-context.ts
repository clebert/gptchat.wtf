import type {AssistantMode} from '../stores/create-assistant-mode-store.js';
import type {ColorScheme} from '../stores/create-color-scheme-store.js';
import type {Completion} from '../stores/create-completion-store.js';
import type {Conversation} from '../stores/create-conversation-store.js';
import type {Message} from '../stores/create-message-store.js';
import type {Model} from '../stores/create-model-store.js';
import type {Store} from '../stores/store.js';

import {createApiKeyStore} from '../stores/create-api-key-store.js';
import {createAssistantModeStore} from '../stores/create-assistant-mode-store.js';
import {createColorSchemeStore} from '../stores/create-color-scheme-store.js';
import {createCompletionStore} from '../stores/create-completion-store.js';
import {createConversationStore} from '../stores/create-conversation-store.js';
import {createDiffModeStore} from '../stores/create-diff-mode-store.js';
import {createMessageStore} from '../stores/create-message-store.js';
import {createModelStore} from '../stores/create-model-store.js';
import * as React from 'react';

export interface App {
  readonly apiKeyStore: Store<string>;
  readonly assistantModeStore: Store<AssistantMode>;
  readonly colorSchemeStore: Store<ColorScheme>;
  readonly completionStore: Store<Completion>;
  readonly conversationStore: Store<Conversation>;
  readonly diffModeStore: Store<boolean>;
  readonly modelStore: Store<Model>;

  getMessageStore(messageId: string): Store<Message>;
  disposeMessageStore(messageId: string): void;
}

const messageStores = new Map<string, Store<Message>>();

export const AppContext = React.createContext<App>({
  apiKeyStore: createApiKeyStore(),
  assistantModeStore: createAssistantModeStore(),
  colorSchemeStore: createColorSchemeStore(),
  completionStore: createCompletionStore(),
  conversationStore: createConversationStore(),
  diffModeStore: createDiffModeStore(),
  modelStore: createModelStore(),

  getMessageStore(messageId: string): Store<Message> {
    let messageStore = messageStores.get(messageId);

    if (!messageStore) {
      messageStore = createMessageStore(messageId);

      messageStores.set(messageId, messageStore);
    }

    return messageStore;
  },

  disposeMessageStore(messageId: string): void {
    const messageStore = messageStores.get(messageId);

    if (messageStore) {
      messageStores.delete(messageId);
      messageStore.get().model.dispose();
      messageStore.dispose();
    }
  },
});

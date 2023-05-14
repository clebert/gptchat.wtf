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
import {createMessageStore} from '../stores/create-message-store.js';
import {createModelStore} from '../stores/create-model-store.js';
import {createContext} from 'preact';

export interface App {
  readonly apiKeyStore: Store<string>;
  readonly assistantModeStore: Store<AssistantMode>;
  readonly colorSchemeStore: Store<ColorScheme>;
  readonly completionStore: Store<Completion>;
  readonly conversationStore: Store<Conversation>;
  readonly modelStore: Store<Model>;

  getMessageStore(id: string): Store<Message>;
  disposeMessageStore(id: string): void;
}

const messageStores = new Map<string, Store<Message>>();

export const AppContext = createContext<App>({
  apiKeyStore: createApiKeyStore(),
  assistantModeStore: createAssistantModeStore(),
  colorSchemeStore: createColorSchemeStore(),
  completionStore: createCompletionStore(),
  conversationStore: createConversationStore(),
  modelStore: createModelStore(),

  getMessageStore(id: string): Store<Message> {
    let messageStore = messageStores.get(id);

    if (!messageStore) {
      messageStore = createMessageStore(id);

      messageStores.set(id, messageStore);
    }

    return messageStore;
  },

  disposeMessageStore(id: string): void {
    const messageStore = messageStores.get(id);

    if (messageStore) {
      messageStores.delete(id);
      messageStore.get().model.dispose();
      messageStore.dispose();
    }
  },
});

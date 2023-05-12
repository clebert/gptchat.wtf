import type {Store} from './store.js';

import {createPersistentStore} from './create-persistent-store.js';
import {array, object, string} from 'zod';

export interface Conversation {
  readonly messageIds: readonly string[];
}

export function createConversationStore(): Store<Conversation> {
  return createPersistentStore(
    `store:conversation`,
    object({messageIds: array(string())}),
    {messageIds: []},
  );
}

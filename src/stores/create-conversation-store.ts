import type {Store} from '../wtfkit/store.js';

import {createJsonStorageItem} from '../wtfkit/create-json-storage-item.js';
import {createValueStore} from '../wtfkit/create-value-store.js';
import {array, object, string} from 'zod';

export interface Conversation {
  readonly messageIds: readonly string[];
}

export function createConversationStore(): Store<Conversation> {
  return createValueStore(
    createJsonStorageItem(
      `conversation`,
      object({messageIds: array(string())}),
    ),
    {messageIds: []},
  );
}

import type {Store} from '../wtfkit/store.js';

import {createJsonStorageItem} from '../wtfkit/create-json-storage-item.js';
import {createValueStore} from '../wtfkit/create-value-store.js';
import {literal} from 'zod';

export type AssistantMode = 'general' | 'programming';

export function createAssistantModeStore(): Store<AssistantMode> {
  return createValueStore(
    createJsonStorageItem(
      `assistant_mode`,
      literal(`general`).or(literal(`programming`)),
    ),
    `general`,
  );
}

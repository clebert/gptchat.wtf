import type {Store} from './store.js';

import {createPersistentStore} from './create-persistent-store.js';
import {literal, union} from 'zod';

export type AssistantMode = 'general' | 'programming';

export function createAssistantModeStore(): Store<AssistantMode> {
  return createPersistentStore(
    `store:assistant_mode`,
    union([literal(`general`), literal(`programming`)]),
    `general`,
  );
}

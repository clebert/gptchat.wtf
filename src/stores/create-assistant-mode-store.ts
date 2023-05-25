import type {Store} from './store.js';

import {createPersistentStore} from './create-persistent-store.js';
import {literal} from 'zod';

export type AssistantMode = 'general' | 'programming';

export function createAssistantModeStore(): Store<AssistantMode> {
  return createPersistentStore(
    `store:assistant_mode`,
    literal(`general`).or(literal(`programming`)),
    `general`,
  );
}

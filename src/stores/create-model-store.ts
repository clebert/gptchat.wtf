import type {Store} from './store.js';

import {createPersistentStore} from './create-persistent-store.js';
import {literal, union} from 'zod';

export type Model = 'gpt-4' | 'gpt-3.5-turbo';

export function createModelStore(): Store<Model> {
  return createPersistentStore(
    `store:model`,
    union([literal(`gpt-4`), literal(`gpt-3.5-turbo`)]),
    `gpt-4`,
  );
}

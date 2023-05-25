import type {Store} from './store.js';

import {createPersistentStore} from './create-persistent-store.js';
import {literal} from 'zod';

export type Model = 'gpt-4' | 'gpt-3.5-turbo';

export function createModelStore(): Store<Model> {
  return createPersistentStore(
    `store:model`,
    literal(`gpt-4`).or(literal(`gpt-3.5-turbo`)),
    `gpt-4`,
  );
}

import type {Store} from '../wtfkit/store.js';

import {createJsonStorageItem} from '../wtfkit/create-json-storage-item.js';
import {createValueStore} from '../wtfkit/create-value-store.js';
import {literal} from 'zod';

export type Model = 'gpt-4' | 'gpt-3.5-turbo';

export function createModelStore(): Store<Model> {
  return createValueStore(
    createJsonStorageItem(
      `model`,
      literal(`gpt-4`).or(literal(`gpt-3.5-turbo`)),
    ),
    `gpt-4`,
  );
}

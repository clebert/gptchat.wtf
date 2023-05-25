import type {Store} from '../wtfkit/store.js';

import {createJsonStorageItem} from '../wtfkit/create-json-storage-item.js';
import {createValueStore} from '../wtfkit/create-value-store.js';
import {string} from 'zod';

export function createApiKeyStore(): Store<string> {
  return createValueStore(createJsonStorageItem(`api_key`, string()), ``);
}

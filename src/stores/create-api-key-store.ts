import type {Store} from './store.js';

import {createPersistentStore} from './create-persistent-store.js';
import {string} from 'zod';

export function createApiKeyStore(): Store<string> {
  return createPersistentStore(`store:api_key`, string(), ``);
}

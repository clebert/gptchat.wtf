import type {Store} from './store.js';

import {createPersistentStore} from './create-persistent-store.js';
import {boolean} from 'zod';

export function createDiffModeStore(): Store<boolean> {
  return createPersistentStore(`store:diff_mode`, boolean(), false);
}

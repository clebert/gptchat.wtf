import type {Store} from '../wtfkit/store.js';

import {createJsonStorageItem} from '../wtfkit/create-json-storage-item.js';
import {createValueStore} from '../wtfkit/create-value-store.js';
import {boolean} from 'zod';

export function createDiffModeStore(): Store<boolean> {
  return createValueStore(createJsonStorageItem(`diff_mode`, boolean()), false);
}

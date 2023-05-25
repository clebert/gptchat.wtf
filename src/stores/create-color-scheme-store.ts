import type {Store} from '../wtfkit/store.js';

import {createJsonStorageItem} from '../wtfkit/create-json-storage-item.js';
import {createValueStore} from '../wtfkit/create-value-store.js';
import {literal, union} from 'zod';

export type ColorScheme = 'auto' | 'light' | 'dark';

export function createColorSchemeStore(): Store<ColorScheme> {
  return createValueStore(
    createJsonStorageItem(
      `color_scheme`,
      union([literal(`auto`), literal(`light`), literal(`dark`)]),
    ),
    `auto`,
  );
}

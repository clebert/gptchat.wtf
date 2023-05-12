import type {Store} from './store.js';

import {createPersistentStore} from './create-persistent-store.js';
import {literal, union} from 'zod';

export type ColorScheme = 'auto' | 'light' | 'dark';

export function createColorSchemeStore(): Store<ColorScheme> {
  return createPersistentStore(
    `store:color_scheme`,
    union([literal(`auto`), literal(`light`), literal(`dark`)]),
    `auto`,
  );
}

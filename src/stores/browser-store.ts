import type {MemoryStoreOptions} from './memory-store.js';
import type {ZodType} from 'zod';

import {MemoryStore} from './memory-store.js';
import {deserializeJson} from '../utils/deserialize-json.js';
import {serializeJson} from '../utils/serialize-json.js';

export interface BrowserStoreOptions<TValue>
  extends MemoryStoreOptions<TValue> {
  readonly key: string;
  readonly schema: ZodType<TValue>;
}

export class BrowserStore<
  TValue extends boolean | number | string | object,
> extends MemoryStore<TValue> {
  readonly #key: string;

  constructor({key, schema, ...options}: BrowserStoreOptions<TValue>) {
    super(options);

    this.#key = key;

    const text = localStorage.getItem(key);

    if (text) {
      super.set(deserializeJson(text, schema));
    }
  }

  override set(newValue: TValue | undefined): void {
    const text = serializeJson(newValue);

    if (text) {
      localStorage.setItem(this.#key, text);

      super.set(newValue);
    } else {
      localStorage.removeItem(this.#key);

      super.set(undefined);
    }
  }
}

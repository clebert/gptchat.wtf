import type {TypeOf, ZodType} from 'zod';

import {JsonStore} from './json-store.js';

export interface BrowserStoreOptions<TSchema extends ZodType> {
  readonly key: string;
  readonly defaultValue: TypeOf<TSchema>;
  readonly schema: TSchema;
  readonly storage?: Pick<Storage, 'getItem' | 'removeItem' | 'setItem'>;
}

export class BrowserStore<TSchema extends ZodType> extends JsonStore<TSchema> {
  readonly #key: string;
  readonly #storage: Pick<Storage, 'getItem' | 'removeItem' | 'setItem'>;

  constructor(options: BrowserStoreOptions<TSchema>) {
    super(options.defaultValue, options.schema);

    this.#key = options.key;
    this.#storage = options.storage ?? localStorage;
  }

  protected get text(): string {
    return this.#storage.getItem(this.#key) ?? ``;
  }

  protected set text(text: string) {
    if (text) {
      this.#storage.setItem(this.#key, text);
    } else {
      this.#storage.removeItem(this.#key);
    }
  }
}

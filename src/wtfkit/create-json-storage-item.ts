import type {ValueAccessor} from './create-value-store.js';
import type {ZodType} from 'zod';

import {deserializeJson} from './deserialize-json.js';
import {serializeJson} from './serialize-json.js';

export function createJsonStorageItem<const TValue>(
  key: string,
  schema: ZodType<TValue>,
): ValueAccessor<TValue> {
  return {
    get value() {
      const text = localStorage.getItem(key);

      return text ? deserializeJson(text, schema) : undefined;
    },

    set value(newValue) {
      const text = serializeJson(newValue);

      if (text) {
        localStorage.setItem(key, text);
      } else {
        localStorage.removeItem(key);
      }
    },
  };
}

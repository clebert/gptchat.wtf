import type {ValueAccessor} from './create-value-store.js';
import type {ZodType} from 'zod';

import {deserializeJson} from './deserialize-json.js';
import {serializeJson} from './serialize-json.js';

export function createJsonLocationParam<const TValue>(
  key: string,
  schema: ZodType<TValue>,
  options?: {readonly replace?: boolean},
): ValueAccessor<TValue> {
  return {
    get value() {
      const text = new URLSearchParams(location.search).get(key);

      return text ? deserializeJson(text, schema) : undefined;
    },

    set value(newValue) {
      const text = serializeJson(newValue);
      const url = new URL(location.href);

      if (text) {
        url.searchParams.set(key, text);
      } else {
        url.searchParams.delete(key);
      }

      if (url.href !== location.href) {
        history[options?.replace ? `replaceState` : `pushState`](
          undefined,
          ``,
          url.href,
        );
      }
    },
  };
}

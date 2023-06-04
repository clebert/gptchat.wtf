import type {z} from 'zod';

import {deserializeJson} from './deserialize-json.js';
import {serializeJson} from './serialize-json.js';

export interface JsonLocationParam<TValue> {
  get value(): TValue | undefined;
  set value(newValue: TValue | undefined);
}

export function createJsonLocationParam<const TValue>(
  key: string,
  schema: z.ZodType<TValue>,
  options?: {readonly replace?: boolean},
): JsonLocationParam<TValue> {
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

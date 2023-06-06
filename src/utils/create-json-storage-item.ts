import type {z} from 'zod';

export interface JsonStorageItem<TValue> {
  get value(): TValue | undefined;
  set value(newValue: TValue | undefined);
}

export function createJsonStorageItem<const TValue>(
  key: string,
  schema: z.ZodType<TValue>,
): JsonStorageItem<TValue> {
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

function deserializeJson<TSchema extends z.ZodType>(
  text: string,
  schema: TSchema,
): z.TypeOf<TSchema> | undefined {
  try {
    return schema.parse(JSON.parse(text));
  } catch {
    return undefined;
  }
}

function serializeJson(value: unknown): string | undefined {
  if (typeof value === `number`) {
    return isFinite(value) ? JSON.stringify(value) : undefined;
  }

  return value != null ? JSON.stringify(value) : undefined;
}

import type {TypeOf, ZodType} from 'zod';

export function deserializeJson<TSchema extends ZodType>(
  text: string,
  schema: TSchema,
): TypeOf<TSchema> | undefined {
  try {
    return schema.parse(JSON.parse(text));
  } catch {
    return undefined;
  }
}

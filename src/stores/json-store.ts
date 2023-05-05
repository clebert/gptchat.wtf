import type {Store} from './reactive-store.js';
import type {TypeOf, ZodType} from 'zod';

export abstract class JsonStore<TSchema extends ZodType>
  implements Store<TypeOf<TSchema>>
{
  readonly #defaultValue: TypeOf<TSchema>;
  readonly #schema: TSchema;

  constructor(defaultValue: TypeOf<TSchema>, schema: TSchema) {
    this.#defaultValue = defaultValue;
    this.#schema = schema;
  }

  protected abstract text: string;

  get value(): TypeOf<TSchema> {
    const {text} = this;

    let value;

    if (text) {
      try {
        value = JSON.parse(text) ?? undefined;
      } catch {}
    }

    const result = this.#schema.safeParse(value);

    return result.success ? result.data : this.#defaultValue;
  }

  set value(newValue: TypeOf<TSchema> | undefined) {
    if (typeof newValue === `number`) {
      this.text = isFinite(newValue) ? JSON.stringify(newValue) : ``;
    } else {
      this.text = newValue != null ? JSON.stringify(newValue) : ``;
    }
  }
}

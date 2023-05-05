export class MemoryStore<TValue> {
  readonly #defaultValue: TValue;

  constructor(defaultValue: TValue) {
    this.#defaultValue = defaultValue;
  }

  #value: TValue | undefined;

  get value(): TValue {
    return this.#value === undefined ? this.#defaultValue : this.#value;
  }

  set value(newValue: TValue | undefined) {
    this.#value = newValue;
  }
}

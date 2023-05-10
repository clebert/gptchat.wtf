import {useSyncExternalStore} from 'preact/compat';

export interface MemoryStoreOptions<TValue> {
  readonly defaultValue: TValue;
}

export class MemoryStore<TValue extends boolean | number | string | object> {
  readonly #defaultValue: TValue;

  constructor({defaultValue}: MemoryStoreOptions<TValue>) {
    this.#defaultValue = defaultValue;
  }

  #value: TValue | undefined;

  get(): TValue {
    return this.#value === undefined ? this.#defaultValue : this.#value;
  }

  readonly #listeners = new Set<() => void>();

  set(newValue: TValue | undefined): void {
    if (newValue !== this.#value) {
      this.#value = newValue;

      for (const listener of this.#listeners) {
        listener();
      }
    }
  }

  useExternalState(): TValue {
    return useSyncExternalStore(
      (listener) => {
        this.#listeners.add(listener);

        return () => {
          this.#listeners.delete(listener);
        };
      },
      () => this.get(),
    );
  }
}

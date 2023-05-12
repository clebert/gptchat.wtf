import {useSyncExternalStore} from 'preact/compat';

export class Store<const TValue> {
  #value: TValue;

  constructor(initialValue: TValue, readonly is: typeof Object.is = Object.is) {
    this.#value = initialValue;
  }

  get(): TValue {
    return this.#value;
  }

  readonly #listeners = new Set<() => void>();

  set(newValue: TValue): void {
    if (!this.is(newValue, this.#value)) {
      this.#value = newValue;

      this.notify();
    }
  }

  use(): TValue {
    return useSyncExternalStore(
      (listener) => this.subscribe(listener),
      () => this.get(),
    );
  }

  subscribe(listener: () => void): () => void {
    this.#listeners.add(listener);

    return () => {
      this.#listeners.delete(listener);
    };
  }

  notify(): void {
    for (const listener of this.#listeners) {
      try {
        listener();
      } catch {}
    }
  }

  dispose(): void {
    this.#listeners.clear();
  }
}

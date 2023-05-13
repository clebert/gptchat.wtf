import {useSyncExternalStore} from 'preact/compat';

export interface StoreOptions {
  onDispose?(): void;
}

export class Store<const TValue> {
  readonly #onDispose?: () => void;

  #value: TValue;

  constructor(initialValue: TValue, options?: StoreOptions) {
    this.#onDispose = options?.onDispose;
    this.#value = initialValue;
  }

  get(): TValue {
    return this.#value;
  }

  readonly #listeners = new Set<() => void>();

  set(newValue: TValue): void {
    if (!Object.is(newValue, this.#value)) {
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
    this.#onDispose?.();
  }
}

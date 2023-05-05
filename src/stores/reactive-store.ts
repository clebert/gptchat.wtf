export type Store<TValue> = {
  get value(): TValue;
  set value(newValue: TValue | undefined);
};

export class ReactiveStore<TValue> {
  readonly #listeners = new Set<() => void>();
  readonly #store: Store<TValue>;

  #snapshot: TValue;

  constructor(store: Store<TValue>) {
    this.#store = store;
    this.#snapshot = store.value;
  }

  readonly getSnapshot = (): TValue => {
    return this.#snapshot;
  };

  readonly publish = (newValue: TValue | undefined): void => {
    this.#store.value = newValue;
    this.#snapshot = this.#store.value;

    for (const listener of this.#listeners) {
      listener();
    }
  };

  readonly subscribe = (listener: () => void): (() => void) => {
    this.#listeners.add(listener);

    return () => {
      this.#listeners.delete(listener);
    };
  };
}

import {Store} from './store.js';

export type Completion =
  | {
      readonly status: 'idle';
    }
  | {
      readonly status: 'sending';
      readonly id: string;
    }
  | {
      readonly status: 'receiving';
      readonly id: string;
      readonly contentDelta: string;
    };

export function createCompletionStore(): Store<Completion> {
  return new Store({status: `idle`});
}

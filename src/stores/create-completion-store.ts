import {Store} from './store.js';

export type Completion =
  | {readonly status: 'idle' | 'sending'}
  | {readonly status: 'receiving'; readonly contentDelta: string};

export function createCompletionStore(): Store<Completion> {
  return new Store({status: `idle`});
}

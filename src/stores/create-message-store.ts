import {Store} from './store.js';
import {createStorageItem} from '../utils/create-storage-item.js';
import debounce from 'lodash.debounce';
import * as monaco from 'monaco-editor';
import {literal, object, string} from 'zod';

export interface Message {
  readonly role?: 'user' | 'assistant';
  readonly model: monaco.editor.ITextModel;
}

export function createMessageStore(messageId: string): Store<Message> {
  const storageItem = createStorageItem(
    `store:message:${messageId}`,
    object({
      role: literal(`user`).or(literal(`assistant`)),
      content: string(),
    }),
  );

  const {role, content} = storageItem.value ?? {content: ``};
  const model = monaco.editor.createModel(content, `markdown`);

  const store = new Store(
    {role, model},
    {
      onDispose: () => {
        storageItem.value = undefined;
      },
    },
  );

  model.onDidChangeContent(() => store.notify());

  store.subscribe(
    debounce(() => {
      const message = store.get();

      storageItem.value = message.role
        ? {role: message.role, content: message.model.getValue()}
        : undefined;
    }, 500),
  );

  return store;
}

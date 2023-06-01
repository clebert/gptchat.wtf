import {createJsonStorageItem} from '../wtfkit/create-json-storage-item.js';
import {Store} from '../wtfkit/store.js';
import debounce from 'lodash.debounce';
import * as monaco from 'monaco-editor';
import * as z from 'zod';

export interface Message {
  readonly role: 'user' | 'assistant';
  readonly model: monaco.editor.ITextModel;
}

export function createMessageStore(messageId: string): Store<Message> {
  const storageItem = createJsonStorageItem(
    `message:${messageId}`,
    z.object({
      role: z.literal(`user`).or(z.literal(`assistant`)),
      content: z.string(),
    }),
  );

  const {role, content} = storageItem.value ?? {role: `user`, content: ``};
  const model = monaco.editor.createModel(content, `markdown`);

  const store = new Store(
    {role, model},
    {
      onDispose: () => {
        model.dispose();

        storageItem.value = undefined;
      },
    },
  );

  model.onDidChangeContent(() => store.notify());

  store.subscribe(
    debounce(() => {
      const message = store.get();

      storageItem.value = {
        role: message.role,
        content: message.model.getValue(),
      };
    }, 500),
  );

  return store;
}

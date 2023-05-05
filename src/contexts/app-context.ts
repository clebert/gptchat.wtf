import type {ChatMessage, Model} from '../apis/create-chat-event-stream.js';

import {BrowserStore} from '../stores/browser-store.js';
import {MemoryStore} from '../stores/memory-store.js';
import {ReactiveStore} from '../stores/reactive-store.js';
import {createContext} from 'preact';
import {array, literal, object, string, union} from 'zod';

export interface App {
  readonly apiKeyStore: ReactiveStore<string>;
  readonly chatCompletionStore: ReactiveStore<ChatCompletion>;
  readonly chatHistoryStore: ReactiveStore<ChatHistory>;
  readonly colorSchemeStore: ReactiveStore<ColorScheme>;
  readonly modelStore: ReactiveStore<Model>;
}

export type ChatCompletion =
  | {readonly status: 'idle' | 'sending'}
  | {readonly status: 'receiving'; readonly contentDelta: string};

export type ChatHistory = readonly ChatHistoryEntry[];

export interface ChatHistoryEntry extends ChatMessage {
  readonly id: string;
}

export type ColorScheme = 'auto' | 'light' | 'dark';

export const AppContext = createContext<App>({
  apiKeyStore: new ReactiveStore(
    new BrowserStore({key: `apiKey`, defaultValue: ``, schema: string()}),
  ),
  chatCompletionStore: new ReactiveStore(
    new MemoryStore<ChatCompletion>({status: `idle`}),
  ),
  chatHistoryStore: new ReactiveStore<ChatHistory>(
    new BrowserStore({
      key: `chatHistory`,
      defaultValue: [
        {
          id: crypto.randomUUID(),
          role: `system`,
          content: `You are an experienced web developer. Always reply in Markdown format.`,
        },
      ],
      schema: array(
        object({
          id: string().uuid(),
          role: union([
            literal(`system`),
            literal(`user`),
            literal(`assistant`),
          ]),
          content: string(),
        }),
      ),
    }),
  ),
  colorSchemeStore: new ReactiveStore(
    new BrowserStore({
      key: `colorScheme`,
      defaultValue: `auto`,
      schema: union([literal(`auto`), literal(`light`), literal(`dark`)]),
    }),
  ),
  modelStore: new ReactiveStore(
    new BrowserStore({
      key: `model`,
      defaultValue: `gpt-4`,
      schema: union([literal(`gpt-4`), literal(`gpt-3.5-turbo`)]),
    }),
  ),
});

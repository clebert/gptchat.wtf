import type {Model} from '../apis/create-chat-event-stream.js';

import {BrowserStore} from '../stores/browser-store.js';
import {MemoryStore} from '../stores/memory-store.js';
import {createContext} from 'preact';
import {array, literal, object, string, union} from 'zod';

export interface Store<TValue> {
  get(): TValue;
  set(newValue: TValue | undefined): void;
  useExternalState(): TValue;
}

export interface App {
  readonly apiKeyStore: Store<string>;
  readonly chatCompletionStore: Store<ChatCompletion>;
  readonly chatHistoryStore: Store<ChatHistory>;
  readonly colorSchemeStore: Store<ColorScheme>;
  readonly modelStore: Store<Model>;
  readonly systemMessageContentStore: Store<string>;
}

export type ChatCompletion =
  | {readonly status: 'idle' | 'sending'}
  | {readonly status: 'receiving'; readonly contentDelta: string};

export type ChatHistory = readonly ChatHistoryEntry[];

export interface ChatHistoryEntry {
  readonly id: string;
  readonly role: 'user' | 'assistant';
  readonly content: string;
}

export type ColorScheme = 'auto' | 'light' | 'dark';

export const AppContext = createContext<App>({
  apiKeyStore: new BrowserStore({
    key: `apiKey`,
    schema: string(),
    defaultValue: ``,
  }),
  chatCompletionStore: new MemoryStore<ChatCompletion>({
    defaultValue: {status: `idle`},
  }),
  chatHistoryStore: new BrowserStore({
    key: `chatHistory`,
    schema: array(
      object({
        id: string().uuid(),
        role: literal(`user`).or(literal(`assistant`)),
        content: string(),
      }),
    ),
    defaultValue: [],
  }),
  colorSchemeStore: new BrowserStore({
    key: `colorScheme`,
    schema: union([literal(`auto`), literal(`light`), literal(`dark`)]),
    defaultValue: `auto`,
  }),
  modelStore: new BrowserStore({
    key: `model`,
    schema: union([literal(`gpt-4`), literal(`gpt-3.5-turbo`)]),
    defaultValue: `gpt-4`,
  }),
  systemMessageContentStore: new BrowserStore({
    key: `systemMessageContent`,
    schema: string(),
    defaultValue: `Please provide responses in *Markdown format* and English language.`,
  }),
});

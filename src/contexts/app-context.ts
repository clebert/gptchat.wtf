import type {ChatMessage, Model} from '../apis/create-chat-event-stream.js';

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
}

export type ChatCompletion =
  | {readonly status: 'idle' | 'sending'}
  | {readonly status: 'receiving'; readonly contentDelta: string};

export type ChatHistory = readonly ChatHistoryEntry[];

export interface ChatHistoryEntry extends ChatMessage {
  readonly id: string;
}

export type ColorScheme = 'auto' | 'light' | 'dark';

const chatHistorySchema = array(
  object({
    id: string().uuid(),
    role: union([literal(`system`), literal(`user`), literal(`assistant`)]),
    content: string(),
  }),
);

const defaultChatHistory: ChatHistory = [
  {
    id: crypto.randomUUID(),
    role: `system`,
    content: `Provide answers in Markdown format and English language. Keep responses short, precise, and at an expert level.`,
  },
];

const colorSchemeSchema = union([
  literal(`auto`),
  literal(`light`),
  literal(`dark`),
]);

const modelSchema = union([literal(`gpt-4`), literal(`gpt-3.5-turbo`)]);

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
    schema: chatHistorySchema,
    defaultValue: defaultChatHistory,
  }),
  colorSchemeStore: new BrowserStore({
    key: `colorScheme`,
    schema: colorSchemeSchema,
    defaultValue: `auto`,
  }),
  modelStore: new BrowserStore({
    key: `model`,
    schema: modelSchema,
    defaultValue: `gpt-4`,
  }),
});

import {apiKeyStore} from '../stores/api-key-store.js';
import {assistantModeStore} from '../stores/assistant-mode-store.js';
import {chatCompletions} from '../stores/chat-completions.js';
import {conversationStore} from '../stores/conversation-store.js';
import {modelStore} from '../stores/model-store.js';
import * as React from 'react';

const generalSystemMessageContent = [
  `- You are an AI assistant`,
  `- Your responses should be informative and logical`,
  `- Keep your responses short and impersonal`,
].join(`\n`);

const programmingSystemMessageContent = [
  `- You are an AI programming assistant`,
  `- Follow the user's requirements carefully & to the letter`,
  `- Your responses should be informative and logical`,
  `- You should always adhere to technical information`,
  `- If the user asks for code or technical questions, you must provide code suggestions and adhere to technical information`,
  `- First think step-by-step - describe your plan for what to build in pseudocode, written out in great detail`,
  `- Then output the code in a single code block`,
  `- Minimize any other prose`,
  `- Keep your responses short and impersonal`,
  `- Use Markdown formatting in your responses`,
  `- Make sure to include the programming language name at the start of the Markdown code blocks`,
  `- Avoid wrapping the whole response in triple backticks`,
  `- Always respond in English, regardless of the user's language`,
].join(`\n`);

export function useRequestCompletionsCallback(): () => void {
  return React.useCallback(() => {
    const apiKeySnapshot = apiKeyStore.get();
    const chatCompletionsIsInitialized = chatCompletions.get(`isInitialized`);

    const [message, ...messages] = conversationStore
      .get()
      .value.messages.map(({role, content}) => ({role, content}));

    if (!apiKeySnapshot.value || !chatCompletionsIsInitialized || !message) {
      return;
    }

    const assistantMode = assistantModeStore.get().state;

    const systemMessage =
      assistantMode !== `freestyle`
        ? {
            role: `system` as const,
            content:
              assistantMode === `general`
                ? generalSystemMessageContent
                : programmingSystemMessageContent,
          }
        : undefined;

    chatCompletionsIsInitialized.actions.send({
      apiKey: apiKeySnapshot.value,
      model: modelStore.get().state,
      messages: [
        ...(systemMessage ? ([systemMessage, message] as const) : ([message] as const)),
        ...messages,
      ],
    });
  }, []);
}

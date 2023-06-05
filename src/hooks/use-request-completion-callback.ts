import type {ChatMessage} from '../openai/create-chat-event-stream.js';
import type {InferSnapshot} from 'state-guard';

import {useAddMessageCallback} from './use-add-message-callback.js';
import {createChatEventGenerator} from '../openai/create-chat-event-generator.js';
import {createChatEventStream} from '../openai/create-chat-event-stream.js';
import {apiKeyStore} from '../stores/api-key-store.js';
import {assistantModeStore} from '../stores/assistant-mode-store.js';
import {completionStore} from '../stores/completion-store.js';
import {conversationStore} from '../stores/conversation-store.js';
import {messageStoreRegistry} from '../stores/message-store-registry.js';
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

export function useRequestCompletionCallback(): () => void {
  const addMessage = useAddMessageCallback();

  return React.useCallback(async () => {
    const apiKeySnapshot = apiKeyStore.get();
    const inactiveCompletion = completionStore.get(`inactive`);

    if (!apiKeySnapshot.value || !inactiveCompletion) {
      return;
    }

    const [message, ...messages] = conversationStore
      .get()
      .value.messageIds.map((messageId): ChatMessage | undefined => {
        const {role, content} = messageStoreRegistry.get(messageId).get().value;

        return content ? {role, content} : undefined;
      })
      .filter(Boolean) as ChatMessage[];

    if (!message) {
      return;
    }

    const completionId = crypto.randomUUID();

    inactiveCompletion.actions.send({id: completionId});

    const abortController = new AbortController();

    completionStore.subscribe(
      () => {
        if (completionStore.get(`inactive`)) {
          abortController.abort();
        }
      },
      {signal: abortController.signal},
    );

    try {
      const chatEventStream = await createChatEventStream(
        {
          apiKey: apiKeySnapshot.value,
          model: modelStore.get().state,
          messages: [
            {
              role: `system`,
              content:
                assistantModeStore.get().state === `general`
                  ? generalSystemMessageContent
                  : programmingSystemMessageContent,
            },
            message,
            ...messages,
          ],
        },
        abortController.signal,
      );

      const chatEventGenerator = createChatEventGenerator(
        chatEventStream.getReader(),
      );

      let completionContent = ``;

      let activeCompletionSnapshot:
        | InferSnapshot<typeof completionStore, 'sending' | 'receiving'>
        | undefined;

      let finishReason: 'stop' | 'length' | 'content_filter' | undefined;

      for await (const chatEvent of chatEventGenerator) {
        activeCompletionSnapshot =
          completionStore.get(`sending`) ?? completionStore.get(`receiving`);

        if (activeCompletionSnapshot?.value.id === completionId) {
          if (`content` in chatEvent) {
            activeCompletionSnapshot.actions.receive({
              id: completionId,
              contentDelta: chatEvent.content,
            });

            completionContent += chatEvent.content;
          } else if (`finishReason` in chatEvent) {
            finishReason = chatEvent.finishReason;
          }
        } else {
          break;
        }
      }

      activeCompletionSnapshot =
        completionStore.get(`sending`) ?? completionStore.get(`receiving`);

      if (activeCompletionSnapshot?.value.id === completionId) {
        activeCompletionSnapshot.actions.cancel();
      }

      addMessage(
        `assistant`,
        completionContent ||
          (finishReason === `length`
            ? `Incomplete content.`
            : finishReason === `content_filter`
            ? `Omitted content.`
            : `No content.`),
      );
    } catch (error) {
      const activeCompletionSnapshot =
        completionStore.get(`sending`) ?? completionStore.get(`receiving`);

      if (activeCompletionSnapshot?.value.id === completionId) {
        activeCompletionSnapshot.actions.cancel();

        addMessage(
          `assistant`,
          error instanceof Error ? error.message : `Unknown error.`,
        );
      }
    }
  }, []);
}

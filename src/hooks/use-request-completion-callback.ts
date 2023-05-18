import type {ChatMessage} from '../apis/create-chat-event-stream.js';
import type {Completion} from '../stores/create-completion-store.js';

import {useAddMessageCallback} from './use-add-message-callback.js';
import {createChatEventGenerator} from '../apis/create-chat-event-generator.js';
import {createChatEventStream} from '../apis/create-chat-event-stream.js';
import {AppContext} from '../contexts/app-context.js';
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
  const {
    apiKeyStore,
    assistantModeStore,
    completionStore,
    conversationStore,
    modelStore,
    getMessageStore,
  } = React.useContext(AppContext);

  const addMessage = useAddMessageCallback();

  return React.useCallback(async () => {
    const apiKey = apiKeyStore.get();

    if (!apiKey || completionStore.get().status !== `idle`) {
      return;
    }

    const [message, ...messages] = conversationStore
      .get()
      .messageIds.map((messageId): ChatMessage | undefined => {
        const {role, model} = getMessageStore(messageId).get();
        const content = model.getValue();

        return role && content ? {role, content} : undefined;
      });

    if (!message) {
      return;
    }

    const abortController = new AbortController();
    const completionId = crypto.randomUUID();

    completionStore.set({status: `sending`, id: completionId});

    try {
      const chatEventStream = await createChatEventStream(
        {
          apiKey,
          model: modelStore.get(),
          messages: [
            {
              role: `system`,
              content:
                assistantModeStore.get() === `general`
                  ? generalSystemMessageContent
                  : programmingSystemMessageContent,
            },
            message,
            ...(messages.filter(Boolean) as ChatMessage[]),
          ],
        },
        abortController.signal,
      );

      const chatEventGenerator = createChatEventGenerator(
        chatEventStream.getReader(),
      );

      let completionContent = ``;
      let completion: Completion;
      let finishReason: 'stop' | 'length' | 'content_filter' | undefined;

      for await (const chatEvent of chatEventGenerator) {
        completion = completionStore.get();

        if (completion.status === `idle` || completion.id !== completionId) {
          abortController.abort();

          break;
        }

        if (`content` in chatEvent) {
          completionStore.set({
            status: `receiving`,
            id: completionId,
            contentDelta: chatEvent.content,
          });

          completionContent += chatEvent.content;
        } else if (`finishReason` in chatEvent) {
          finishReason = chatEvent.finishReason;
        }
      }

      completion = completionStore.get();

      if (completion.status !== `idle` && completion.id === completionId) {
        completionStore.set({status: `idle`});
      }

      addMessage(
        `assistant`,
        completionContent ||
          (finishReason === `length`
            ? `Incomplete content`
            : finishReason === `content_filter`
            ? `Omitted content`
            : `No content`),
      );
    } catch (error) {
      const completion = completionStore.get();

      if (completion.status !== `idle` && completion.id === completionId) {
        completionStore.set({status: `idle`});

        addMessage(
          `assistant`,
          error instanceof Error ? error.message : `Unknown error`,
        );
      }
    }
  }, [addMessage]);
}

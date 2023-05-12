import type {ChatMessage} from '../apis/create-chat-event-stream.js';

import {useAddMessageCallback} from './use-add-message-callback.js';
import {createChatEventGenerator} from '../apis/create-chat-event-generator.js';
import {createChatEventStream} from '../apis/create-chat-event-stream.js';
import {AppContext} from '../contexts/app-context.js';
import {useCallback, useContext} from 'preact/hooks';

export function useRequestCompletionCallback(): () => void {
  const {
    apiKeyStore,
    completionStore,
    conversationStore,
    modelStore,
    getMessageStore,
  } = useContext(AppContext);

  const addMessage = useAddMessageCallback();

  return useCallback(async () => {
    const apiKey = apiKeyStore.get();

    if (!apiKey || completionStore.get().status !== `idle`) {
      return;
    }

    const [message, ...messages] = conversationStore
      .get()
      .messageIds.map((id): ChatMessage | undefined => {
        const {role, model} = getMessageStore(id).get();
        const content = model.getValue();

        return role && content ? {role, content} : undefined;
      });

    if (!message) {
      return;
    }

    const abortController = new AbortController();

    completionStore.set({status: `sending`});

    try {
      const chatEventStream = await createChatEventStream(
        {
          apiKey,
          model: modelStore.get(),
          messages: [
            {
              role: `system`,
              content: `Please provide responses in *Markdown format* and English language.`,
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

      for await (const chatEvent of chatEventGenerator) {
        if (completionStore.get().status === `idle`) {
          abortController.abort();

          break;
        }

        if (`content` in chatEvent) {
          completionStore.set({
            status: `receiving`,
            contentDelta: chatEvent.content,
          });

          completionContent += chatEvent.content;
        } else if (`finishReason` in chatEvent) {
          // TODO
        }
      }

      completionStore.set({status: `idle`});

      addMessage(`assistant`, completionContent);
    } catch (error) {
      completionStore.set({status: `idle`});

      addMessage(
        `assistant`,
        error instanceof Error ? error.message : `Unknown error.`,
      );
    }
  }, [addMessage]);
}

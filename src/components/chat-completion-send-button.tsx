import type {ChatMessage} from '../apis/create-chat-event-stream.js';
import type {JSX} from 'preact';

import {Button} from './button.js';
import {Icon} from './icon.js';
import {createChatEventGenerator} from '../apis/create-chat-event-generator.js';
import {createChatEventStream} from '../apis/create-chat-event-stream.js';
import {AppContext} from '../contexts/app-context.js';
import {useCallback, useContext} from 'preact/hooks';

export interface ChatCompletionSendButtonProps {
  onBeforeSend?(): void;
}

export function ChatCompletionSendButton({
  onBeforeSend,
}: ChatCompletionSendButtonProps): JSX.Element {
  const {
    apiKeyStore,
    chatCompletionStore,
    chatHistoryStore,
    modelStore,
    systemMessageContentStore,
  } = useContext(AppContext);

  const apiKey = apiKeyStore.useExternalState();
  const chatCompletion = chatCompletionStore.useExternalState();
  const chatHistory = chatHistoryStore.useExternalState();

  const sendChat = useCallback(async () => {
    if (!apiKey || chatCompletion.status !== `idle`) {
      return;
    }

    onBeforeSend?.();

    const [chatMessage, ...chatMessages] = chatHistoryStore.get();

    if (!chatMessage) {
      return;
    }

    const systemMessageContent = systemMessageContentStore.get();

    const systemMessage: ChatMessage | undefined = systemMessageContent
      ? {role: `system`, content: systemMessageContent}
      : undefined;

    try {
      const abortController = new AbortController();

      chatCompletionStore.set({status: `sending`});

      const chatEventStream = await createChatEventStream(
        {
          apiKey,
          model: modelStore.get(),
          messages: systemMessage
            ? [systemMessage, chatMessage, ...chatMessages]
            : [chatMessage, ...chatMessages],
        },
        abortController.signal,
      );

      const chatEventGenerator = createChatEventGenerator(
        chatEventStream.getReader(),
      );

      let content = ``;

      for await (const chatEvent of chatEventGenerator) {
        if (chatCompletionStore.get().status === `idle`) {
          abortController.abort();

          break;
        }

        if (`content` in chatEvent) {
          chatCompletionStore.set({
            status: `receiving`,
            contentDelta: chatEvent.content,
          });

          content += chatEvent.content;
        } else if (`finishReason` in chatEvent) {
          // TODO
        }
      }

      if (chatCompletionStore.get().status !== `idle`) {
        chatCompletionStore.set({status: `idle`});
      }

      chatHistoryStore.set([
        ...chatHistoryStore.get(),
        {id: crypto.randomUUID(), role: `assistant`, content},
      ]);
    } catch (error) {
      chatCompletionStore.set({status: `idle`});

      const content = error instanceof Error ? error.message : `Unknown error.`;

      chatHistoryStore.set([
        ...chatHistoryStore.get(),
        {id: crypto.randomUUID(), role: `assistant`, content},
      ]);
    }
  }, [apiKey, chatCompletion, chatHistory]);

  return (
    <Button
      title="Send chat completion"
      disabled={!apiKey || chatCompletion.status !== `idle`}
      onClick={sendChat}
    >
      <Icon type="paperAirplane" standalone />
    </Button>
  );
}

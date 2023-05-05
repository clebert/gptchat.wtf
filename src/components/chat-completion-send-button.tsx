import type {
  ChatCompletion,
  ChatHistory,
  ChatHistoryEntry,
} from '../contexts/app-context.js';
import type {JSX} from 'preact';

import {createChatEventGenerator} from '../apis/create-chat-event-generator.js';
import {createChatEventStream} from '../apis/create-chat-event-stream.js';
import {AppContext} from '../contexts/app-context.js';
import {Button} from '../core-components/button.js';
import {Icon} from '../core-components/icon.js';
import {useSyncExternalStore} from 'preact/compat';
import {useCallback, useContext} from 'preact/hooks';

export interface ChatCompletionSendButtonProps {
  onBeforeSend?(): void;
}

export function ChatCompletionSendButton({
  onBeforeSend,
}: ChatCompletionSendButtonProps): JSX.Element {
  const {apiKeyStore, chatCompletionStore, chatHistoryStore, modelStore} =
    useContext(AppContext);

  const apiKey = useSyncExternalStore(
    apiKeyStore.subscribe,
    apiKeyStore.getSnapshot,
  );

  const chatCompletion = useSyncExternalStore(
    chatCompletionStore.subscribe,
    chatCompletionStore.getSnapshot,
  );

  const chatHistory = useSyncExternalStore(
    chatHistoryStore.subscribe,
    chatHistoryStore.getSnapshot,
  );

  const sendChat = useCallback(async () => {
    if (!isEnabled(apiKey, chatCompletion, chatHistory)) {
      return;
    }

    onBeforeSend?.();

    chatCompletionStore.publish({status: `sending`});

    try {
      const abortController = new AbortController();

      const chatEventStream = await createChatEventStream(
        {
          apiKey,
          model: modelStore.getSnapshot(),
          messages: chatHistoryStore.getSnapshot() as any, // TODO
        },
        abortController.signal,
      );

      const chatEventGenerator = createChatEventGenerator(
        chatEventStream.getReader(),
      );

      let content = ``;

      for await (const chatEvent of chatEventGenerator) {
        if (chatCompletionStore.getSnapshot().status === `idle`) {
          abortController.abort();

          break;
        }

        if (`content` in chatEvent) {
          chatCompletionStore.publish({
            status: `receiving`,
            contentDelta: chatEvent.content,
          });

          content += chatEvent.content;
        } else if (`finishReason` in chatEvent) {
          // TODO
        }
      }

      if (chatCompletionStore.getSnapshot().status !== `idle`) {
        chatCompletionStore.publish({status: `idle`});
      }

      chatHistoryStore.publish([
        ...chatHistoryStore.getSnapshot(),
        {id: crypto.randomUUID(), role: `assistant`, content},
      ]);
    } catch (error) {
      chatCompletionStore.publish({status: `idle`});

      const content = error instanceof Error ? error.message : `Unknown error.`;

      chatHistoryStore.publish([
        ...chatHistoryStore.getSnapshot(),
        {id: crypto.randomUUID(), role: `assistant`, content},
      ]);
    }
  }, [apiKey, chatCompletion, chatHistory]);

  return (
    <Button
      title="Send chat completion"
      disabled={!isEnabled(apiKey, chatCompletion, chatHistory)}
      onClick={sendChat}
    >
      <Icon type="paperAirplane" standalone />
    </Button>
  );
}

function isEnabled(
  apiKey: string,
  chatCompletion: ChatCompletion,
  chatHistory: ChatHistory,
): chatHistory is readonly [ChatHistoryEntry, ...ChatHistoryEntry[]] {
  return Boolean(
    apiKey && chatCompletion.status === `idle` && chatHistory.length > 0,
  );
}

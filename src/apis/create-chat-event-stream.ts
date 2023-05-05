export interface ChatCompletionRequest {
  readonly apiKey: string;
  readonly model: Model;
  readonly messages: readonly [ChatMessage, ...ChatMessage[]];
}

export type Model = 'gpt-4' | 'gpt-3.5-turbo';

export interface ChatMessage {
  readonly role: ChatMessageRole;
  readonly content: string;
}

export type ChatMessageRole = 'system' | 'user' | 'assistant';

export async function createChatEventStream(
  request: ChatCompletionRequest,
  signal: AbortSignal,
): Promise<ReadableStream<Uint8Array>> {
  const {apiKey, model, messages} = request;

  const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
    method: `POST`,
    headers: {
      'Content-Type': `application/json`,
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: messages.map(({role, content}) => ({role, content})),
      stream: true,
    }),
    signal,
  });

  if (!response.body || !response.ok) {
    throw new Error(`Error connecting to OpenAI API: ${response.statusText}`);
  }

  return response.body;
}

export interface ChatCompletionRequest {
  readonly apiKey: string;
  readonly model: 'gpt-4' | 'gpt-3.5-turbo';
  readonly messages: readonly [ChatMessage, ...ChatMessage[]];
}

export interface ChatMessage {
  readonly role: 'system' | 'user' | 'assistant';
  readonly content: string;
}

export async function createChatEventStream(
  request: ChatCompletionRequest,
  signal: AbortSignal,
): Promise<ReadableStream<Uint8Array>> {
  const {apiKey, model, messages} = request;

  const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
    method: `POST`,
    headers: {'Content-Type': `application/json`, 'Authorization': `Bearer ${apiKey}`},
    body: JSON.stringify({
      model,
      messages: messages.map(({role, content}) => ({role, content})),
      stream: true,
    }),
    signal,
  });

  const {body} = response;

  if (!body || !response.ok) {
    throw new Error(`Error connecting to OpenAI API: ${response.statusText}`);
  }

  signal.addEventListener(`abort`, () => {
    if (!body.locked) {
      void body.cancel();
    }
  });

  return body;
}

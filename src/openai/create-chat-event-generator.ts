import {z} from 'zod';

export type ChatEvent =
  | {readonly role: 'assistant'}
  | {readonly content: string}
  | {readonly finishReason: 'stop' | 'length' | 'content_filter'};

const choicesResponseSchema = z.object({
  choices: z.tuple([
    z
      .object({
        delta: z.object({role: z.literal(`assistant`)}).or(z.object({content: z.string()})),
      })
      .or(
        z.object({
          finish_reason: z.union([
            z.literal(`stop`),
            z.literal(`length`),
            z.literal(`content_filter`),
          ]),
        }),
      ),
  ]),
});

const errorResponseSchema = z.object({
  error: z.object({message: z.string()}),
});

export async function* createChatEventGenerator(
  reader: Pick<ReadableStreamDefaultReader<Uint8Array>, 'read'>,
): AsyncGenerator<ChatEvent> {
  const decoder = new TextDecoder(`utf-8`);

  let buffer: string | undefined;

  while (true) {
    let result;

    try {
      result = await reader.read();

      if (result.done) {
        return;
      }
    } catch {
      return;
    }

    const chunk = decoder.decode(result.value, {stream: true});

    if (buffer === undefined) {
      let response: z.TypeOf<typeof errorResponseSchema> | undefined;

      try {
        response = errorResponseSchema.parse(JSON.parse(chunk));
      } catch {}

      if (response) {
        throw new Error(response.error.message);
      }

      buffer = ``;
    }

    buffer += chunk;

    while (true) {
      const newLineIndex = buffer.indexOf(`\n`);

      if (newLineIndex === -1) {
        break;
      }

      const line = buffer.slice(0, newLineIndex);

      buffer = buffer.slice(newLineIndex + 1);

      if (line.startsWith(`data:`)) {
        const data = line.slice(5).trim();

        if (data && data !== `[DONE]`) {
          const response = choicesResponseSchema.parse(JSON.parse(data));
          const [choice] = response.choices;

          if (`finish_reason` in choice) {
            yield {finishReason: choice.finish_reason};
          } else {
            yield choice.delta;
          }
        }
      }
    }
  }
}

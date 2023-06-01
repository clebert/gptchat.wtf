import type {TypeOf} from 'zod';

import * as zod from 'zod';

export type ChatEvent =
  | {readonly role: 'assistant'}
  | {readonly content: string}
  | {readonly finishReason: 'stop' | 'length' | 'content_filter'};

const choicesResponseSchema = zod.object({
  choices: zod.tuple([
    zod
      .object({
        delta: zod
          .object({role: zod.literal(`assistant`)})
          .or(zod.object({content: zod.string()})),
      })
      .or(
        zod.object({
          finish_reason: zod.union([
            zod.literal(`stop`),
            zod.literal(`length`),
            zod.literal(`content_filter`),
          ]),
        }),
      ),
  ]),
});

const errorResponseSchema = zod.object({
  error: zod.object({message: zod.string()}),
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
      let response: TypeOf<typeof errorResponseSchema> | undefined;

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

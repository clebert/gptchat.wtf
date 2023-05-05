import type {TypeOf} from 'zod';

import {literal, object, string, tuple, union} from 'zod';

export type ChatEvent =
  | {readonly role: 'assistant'}
  | {readonly content: string}
  | {readonly finishReason: 'stop' | 'length' | 'content_filter'};

const choicesResponseSchema = object({
  choices: tuple([
    object({
      delta: object({role: literal(`assistant`)}).or(
        object({content: string()}),
      ),
    }).or(
      object({
        finish_reason: union([
          literal(`stop`),
          literal(`length`),
          literal(`content_filter`),
        ]),
      }),
    ),
  ]),
});

const errorResponseSchema = object({error: object({message: string()})});

export async function* createChatEventGenerator(
  reader: Pick<ReadableStreamDefaultReader<Uint8Array>, 'read'>,
): AsyncGenerator<ChatEvent> {
  const decoder = new TextDecoder(`utf-8`);

  let buffer: string | undefined;

  while (true) {
    const {value, done} = await reader.read();

    if (done) {
      break;
    }

    const chunk = decoder.decode(value, {stream: true});

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

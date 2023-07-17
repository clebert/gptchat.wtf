import type {Message} from '../machines/messages-machine.js';

import {Editor} from './editor.js';
import {MessageIcon} from './message-icon.js';
import {completionsMachine} from '../machines/completions-machine.js';
import {messagesMachine} from '../machines/messages-machine.js';
import {isUserScrolledToBottom} from '../utils/is-user-scrolled-to-bottom.js';
import * as monaco from 'monaco-editor';
import * as React from 'react';
import {Button, Container, Icon} from 'wtfkit';

export function CompletionsView(): JSX.Element {
  const model = React.useMemo(() => monaco.editor.createModel(``, `markdown`), []);

  React.useEffect(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);

    return () => {
      model.dispose();
    };
  }, []);

  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>(null);

  const completionsSnapshot = React.useSyncExternalStore(completionsMachine.subscribe, () =>
    completionsMachine.get(),
  );

  React.useEffect(() => {
    if (completionsSnapshot.state !== `isReceiving`) {
      return;
    }

    const editor = editorRef.current!;
    const contentHeight = editor.getContentHeight();
    const userScrolledToBottom = isUserScrolledToBottom();
    const lastLineNumber = model.getLineCount();
    const lastLineColumn = model.getLineMaxColumn(lastLineNumber);

    model.pushEditOperations(
      null,
      [
        {
          range: {
            startLineNumber: lastLineNumber,
            startColumn: lastLineColumn,
            endLineNumber: lastLineNumber,
            endColumn: lastLineColumn,
          },
          text: completionsSnapshot.value.contentDelta,
        },
      ],
      () => null,
    );

    if (userScrolledToBottom && editor.getContentHeight() !== contentHeight) {
      window.scrollTo(0, document.documentElement.scrollHeight);
    }
  }, [completionsSnapshot]);

  React.useEffect(() => {
    if (completionsSnapshot.state !== `isFinished` && completionsSnapshot.state !== `isFailed`) {
      return;
    }

    const messagesSnapshot = messagesMachine.get();
    const newMessages: Message[] = [...messagesSnapshot.value];
    const {content = ``} = completionsSnapshot.value;

    if (completionsSnapshot.state === `isFailed`) {
      newMessages.push({
        messageId: crypto.randomUUID(),
        role: `assistant`,
        content: `[error] ${content}`.trim(),
      });
    } else if (completionsSnapshot.value.reason !== `stop`) {
      newMessages.push({
        messageId: crypto.randomUUID(),
        role: `assistant`,
        content: `[${completionsSnapshot.value.reason}] ${content}`.trim(),
      });
    } else {
      newMessages.push({messageId: crypto.randomUUID(), role: `assistant`, content});
    }

    if (completionsSnapshot.state === `isFailed`) {
      console.error(completionsSnapshot.value.error);
    }

    messagesSnapshot.actions.initialize(newMessages);
    completionsSnapshot.actions.initialize();
  }, [completionsSnapshot]);

  const cancelCompletions = React.useMemo(
    () =>
      completionsSnapshot.state === `isSending`
        ? () => {
            completionsSnapshot.actions.initialize();
          }
        : completionsSnapshot.state === `isReceiving`
        ? () => {
            completionsSnapshot.actions.finish({
              reason: `stop`,
              content: completionsSnapshot.value.content,
            });
          }
        : undefined,
    [completionsSnapshot],
  );

  return (
    <Container>
      <Container col grow>
        <Editor ref={editorRef} model={model} readOnly />
      </Container>

      <Container col>
        <Button title="Cancel chat completions" onClick={cancelCompletions}>
          <Icon type="xMark" standalone />
        </Button>

        <MessageIcon role="assistant" />
      </Container>
    </Container>
  );
}

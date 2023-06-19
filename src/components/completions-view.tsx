import type {Message} from '../machines/messages-machine.js';

import {Button} from './button.js';
import {Editor} from './editor.js';
import {Icon} from './icon.js';
import {MessageRoleIcon} from './message-role-icon.js';
import {completionsMachine} from '../machines/completions-machine.js';
import {messagesMachine} from '../machines/messages-machine.js';
import {isUserScrolledToBottom} from '../utils/is-user-scrolled-to-bottom.js';
import * as monaco from 'monaco-editor';
import * as React from 'react';

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

    if (completionsSnapshot.value.content) {
      newMessages.push({
        messageId: crypto.randomUUID(),
        role: `assistant`,
        content: completionsSnapshot.value.content,
      });
    }

    if (completionsSnapshot.state === `isFailed`) {
      newMessages.push({
        messageId: crypto.randomUUID(),
        role: `assistant`,
        content: String(completionsSnapshot.value.error),
      });
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
    <div className="flex space-x-2">
      <div className="w-full overflow-hidden">
        <Editor ref={editorRef} model={model} readOnly />
      </div>

      <div className="flex shrink-0 flex-col space-y-2">
        <Button title="Cancel Chat Completions" onClick={cancelCompletions}>
          <Icon type="xMark" standalone />
        </Button>

        <MessageRoleIcon role="assistant" />
      </div>
    </div>
  );
}

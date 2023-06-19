import {Button} from './button.js';
import {Editor} from './editor.js';
import {Icon} from './icon.js';
import {MessageRoleIcon} from './message-role-icon.js';
import {useAddMessageCallback} from '../hooks/use-add-message-callback.js';
import {chatCompletions} from '../stores/chat-completions.js';
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

  const chatCompletionsSnapshot = React.useSyncExternalStore(chatCompletions.subscribe, () =>
    chatCompletions.get(),
  );

  React.useEffect(() => {
    if (chatCompletionsSnapshot.state !== `isReceiving`) {
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
          text: chatCompletionsSnapshot.value.contentDelta,
        },
      ],
      () => null,
    );

    if (userScrolledToBottom && editor.getContentHeight() !== contentHeight) {
      window.scrollTo(0, document.documentElement.scrollHeight);
    }
  }, [chatCompletionsSnapshot]);

  const addMessage = useAddMessageCallback();

  React.useEffect(() => {
    if (
      chatCompletionsSnapshot.state !== `isFinished` &&
      chatCompletionsSnapshot.state !== `isFailed`
    ) {
      return;
    }

    if (chatCompletionsSnapshot.value.content) {
      addMessage(`assistant`, chatCompletionsSnapshot.value.content);
    }

    if (chatCompletionsSnapshot.state === `isFailed`) {
      addMessage(`assistant`, String(chatCompletionsSnapshot.value.error));
    }

    chatCompletionsSnapshot.actions.initialize();
  }, [chatCompletionsSnapshot]);

  const cancelCompletions = React.useCallback(() => {
    if (chatCompletionsSnapshot.state === `isSending`) {
      chatCompletionsSnapshot.actions.initialize();
    } else if (chatCompletionsSnapshot.state === `isReceiving`) {
      chatCompletionsSnapshot.actions.finish({
        reason: `stop`,
        content: chatCompletionsSnapshot.value.content,
      });
    }
  }, [chatCompletionsSnapshot]);

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

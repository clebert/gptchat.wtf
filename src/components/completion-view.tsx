import {Button} from './button.js';
import {Editor} from './editor.js';
import {Icon} from './icon.js';
import {MessageRoleIcon} from './message-role-icon.js';
import {completionStore} from '../stores/completion-store.js';
import {isUserScrolledToBottom} from '../utils/is-user-scrolled-to-bottom.js';
import * as monaco from 'monaco-editor';
import * as React from 'react';

export function CompletionView(): JSX.Element {
  const model = React.useMemo(
    () => monaco.editor.createModel(``, `markdown`),
    [],
  );

  React.useEffect(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);

    return () => {
      model.dispose();
    };
  }, []);

  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>(null);

  const receivingCompletionSnapshot = React.useSyncExternalStore(
    completionStore.subscribe,
    () => completionStore.get(`receiving`),
  );

  React.useEffect(() => {
    if (receivingCompletionSnapshot) {
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
            text: receivingCompletionSnapshot.value.contentDelta,
          },
        ],
        () => null,
      );

      if (userScrolledToBottom && editor.getContentHeight() !== contentHeight) {
        window.scrollTo(0, document.documentElement.scrollHeight);
      }
    }
  }, [receivingCompletionSnapshot]);

  const cancelCompletion = React.useCallback(() => {
    (
      completionStore.get(`sending`) ?? completionStore.get(`receiving`)
    )?.actions.cancel();
  }, []);

  return (
    <div className="flex space-x-2">
      <div className="w-full overflow-hidden">
        <Editor ref={editorRef} model={model} readOnly />
      </div>

      <div className="flex shrink-0 flex-col space-y-2">
        <Button title="Cancel Chat Completion" onClick={cancelCompletion}>
          <Icon type="xMark" standalone />
        </Button>

        <MessageRoleIcon role="assistant" />
      </div>
    </div>
  );
}

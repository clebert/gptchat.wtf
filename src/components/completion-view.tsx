import {Button} from './button.js';
import {Editor} from './editor.js';
import {Icon} from './icon.js';
import {MessageRoleIcon} from './message-role-icon.js';
import {AppContext} from '../contexts/app-context.js';
import {useCancelCompletionCallback} from '../hooks/use-cancel-completion-callback.js';
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

  const {completionStore} = React.useContext(AppContext);
  const completion = completionStore.use();

  React.useEffect(() => {
    if (completion.status === `receiving`) {
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
            text: completion.contentDelta,
          },
        ],
        () => null,
      );

      if (userScrolledToBottom && model.getLineCount() !== lastLineNumber) {
        window.scrollTo(0, document.documentElement.scrollHeight);
      }
    }
  }, [completion]);

  const cancelCompletion = useCancelCompletionCallback();

  return (
    <div className="flex space-x-2">
      <div className="w-full overflow-hidden">
        <Editor model={model} readOnly />
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

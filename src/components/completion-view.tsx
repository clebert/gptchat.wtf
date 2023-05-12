import type {JSX} from 'preact';

import {Button} from './button.js';
import {Editor} from './editor.js';
import {Icon} from './icon.js';
import {MessageRoleIcon} from './message-role-icon.js';
import {AppContext} from '../contexts/app-context.js';
import {useCancelCompletionCallback} from '../hooks/use-cancel-completion-callback.js';
import * as monaco from 'monaco-editor';
import {useContext, useEffect, useMemo} from 'preact/hooks';

export function CompletionView(): JSX.Element {
  const model = useMemo(() => monaco.editor.createModel(``, `markdown`), []);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);

    return () => model.dispose();
  }, []);

  const {completionStore} = useContext(AppContext);
  const completion = completionStore.use();

  useEffect(() => {
    if (completion.status === `receiving`) {
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
    } else {
      model.setValue(``);
    }
  }, [completion]);

  const cancelCompletion = useCancelCompletionCallback();

  return (
    <div className="flex space-x-2">
      <div class="flex shrink-0 flex-col space-y-2">
        <Button title="Cancel Chat Completion" onClick={cancelCompletion}>
          <Icon type="xMark" standalone />
        </Button>

        <MessageRoleIcon role="assistant" />
      </div>

      <div class="w-full overflow-hidden">
        <Editor class="h-40" model={model} autoScroll readOnly />
      </div>
    </div>
  );
}

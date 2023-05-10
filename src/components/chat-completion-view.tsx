import type {JSX} from 'preact';

import {ChatCompletionCancelButton} from './chat-completion-cancel-button.js';
import {Editor} from './editor.js';
import {RoleIcon} from './role-icon.js';
import {AppContext} from '../contexts/app-context.js';
import * as monaco from 'monaco-editor';
import {useContext, useEffect, useMemo} from 'preact/hooks';

export function ChatCompletionView(): JSX.Element {
  const model = useMemo(() => monaco.editor.createModel(``, `markdown`), []);

  useEffect(() => () => model.dispose(), []);

  const {chatCompletionStore} = useContext(AppContext);
  const chatCompletion = chatCompletionStore.useExternalState();

  useEffect(() => {
    if (chatCompletion.status === `receiving`) {
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
            text: chatCompletion.contentDelta,
          },
        ],
        () => null,
      );
    } else {
      model.setValue(``);
    }
  }, [chatCompletion]);

  return chatCompletion.status !== `idle` ? (
    <div className="flex space-x-2">
      <div class="flex shrink-0 flex-col space-y-2">
        <ChatCompletionCancelButton />
        <RoleIcon role="assistant" />
      </div>
      <div class="w-full overflow-hidden">
        <Editor model={model} autoScroll readOnly />
      </div>
    </div>
  ) : (
    <></>
  );
}

import type {JSX} from 'preact';

import {Button} from './button.js';
import {Editor} from './editor.js';
import {Icon} from './icon.js';
import {MessageRoleIcon} from './message-role-icon.js';
import {useAddMessageCallback} from '../hooks/use-add-message-callback.js';
import {useRequestCompletionCallback} from '../hooks/use-request-completion-callback.js';
import * as monaco from 'monaco-editor';
import {useCallback, useEffect, useMemo} from 'preact/hooks';

export function NewMessageView(): JSX.Element {
  const model = useMemo(() => monaco.editor.createModel(``, `markdown`), []);

  useEffect(() => {
    return () => model.dispose();
  }, []);

  const addMessage = useAddMessageCallback();

  const handleAddMessageClick = useCallback(() => {
    const content = model.getValue();

    if (content) {
      addMessage(`user`, model.getValue());
      model.setValue(``);
    }
  }, [addMessage]);

  const requestCompletion = useRequestCompletionCallback();

  const handleRequestCompletionClick = useCallback(() => {
    handleAddMessageClick();
    requestCompletion();
  }, [handleAddMessageClick, requestCompletion]);

  return (
    <div className="flex space-x-2">
      <div class="w-full overflow-hidden">
        <Editor model={model} />
      </div>

      <div class="flex shrink-0 flex-col space-y-2">
        <Button
          title="Request Chat Completion"
          inverted
          onClick={handleRequestCompletionClick}
        >
          <Icon type="paperAirplane" standalone />
        </Button>

        <Button title="Add Chat Message" onClick={handleAddMessageClick}>
          <Icon type="plus" standalone />
        </Button>

        <MessageRoleIcon role="user" />
      </div>
    </div>
  );
}

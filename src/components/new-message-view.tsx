import {Button} from './button.js';
import {Editor} from './editor.js';
import {Icon} from './icon.js';
import {MessageRoleIcon} from './message-role-icon.js';
import {AppContext} from '../contexts/app-context.js';
import {useAddMessageCallback} from '../hooks/use-add-message-callback.js';
import {useRequestCompletionCallback} from '../hooks/use-request-completion-callback.js';
import {isTouchDevice} from '../utils/is-touch-device.js';
import * as monaco from 'monaco-editor';
import * as React from 'react';

export function NewMessageView(): JSX.Element {
  const model = React.useMemo(
    () => monaco.editor.createModel(``, `markdown`),
    [],
  );

  React.useEffect(() => {
    return () => {
      model.dispose();
    };
  }, []);

  const addMessage = useAddMessageCallback();

  const handleAddMessageClick = React.useCallback(() => {
    const content = model.getValue();

    if (content) {
      addMessage(`user`, model.getValue());
      model.setValue(``);
    }
  }, [addMessage]);

  const requestCompletion = useRequestCompletionCallback();

  const handleRequestCompletionClick = React.useCallback(() => {
    handleAddMessageClick();
    requestCompletion();
  }, [handleAddMessageClick, requestCompletion]);

  const {apiKeyStore} = React.useContext(AppContext);
  const apiKey = apiKeyStore.use();

  return (
    <div ref={containerRef} className="flex space-x-2">
      <div className="w-full overflow-hidden">
        <Editor
          model={model}
          autoFocus={apiKey.length > 0 && !isTouchDevice()}
          autoScroll
        />
      </div>

      <div className="flex shrink-0 flex-col space-y-2">
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

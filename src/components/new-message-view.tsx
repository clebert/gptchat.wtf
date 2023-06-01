import {Button} from './button.js';
import {Editor} from './editor.js';
import {Icon} from './icon.js';
import {MessageRoleIcon} from './message-role-icon.js';
import {useAddMessageCallback} from '../hooks/use-add-message-callback.js';
import {useRequestCompletionCallback} from '../hooks/use-request-completion-callback.js';
import {apiKeyStore} from '../stores/api-key-store.js';
import {isTouchDevice} from '../utils/is-touch-device.js';
import {useStore} from '../wtfkit/use-store.js';
import * as monaco from 'monaco-editor';
import * as React from 'react';

export function NewMessageView(): JSX.Element {
  const model = React.useMemo(
    () => monaco.editor.createModel(``, `markdown`),
    [],
  );

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setTimeout(() => {
      const {scrollTop} = document.documentElement;
      const {top} = containerRef.current!.getBoundingClientRect();

      window.scrollTo({top: scrollTop + top});
    }, 0);

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

  const apiKeySnapshot = useStore(apiKeyStore);

  return (
    <div ref={containerRef} className="flex space-x-2">
      <div className="w-full overflow-hidden">
        <Editor
          model={model}
          autoFocus={apiKeySnapshot.value.length > 0 && !isTouchDevice()}
          autoScroll
        />
      </div>

      <div className="flex shrink-0 flex-col space-y-2">
        <Button
          title="Request Chat Completion"
          inverted
          disabled={!apiKeySnapshot.value}
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

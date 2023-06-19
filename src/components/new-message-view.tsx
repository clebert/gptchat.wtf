import {Button} from './button.js';
import {Editor} from './editor.js';
import {Icon} from './icon.js';
import {MessageRoleIcon} from './message-role-icon.js';
import {useAddMessageCallback} from '../hooks/use-add-message-callback.js';
import {useRequestCompletionsCallback} from '../hooks/use-request-completions-callback.js';
import {apiKeyStore} from '../stores/api-key-store.js';
import {isTouchDevice} from '../utils/is-touch-device.js';
import * as monaco from 'monaco-editor';
import * as React from 'react';

export function NewMessageView(): JSX.Element {
  const model = React.useMemo(() => monaco.editor.createModel(``, `markdown`), []);
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
  }, []);

  const requestCompletions = useRequestCompletionsCallback();

  const handleRequestCompletionsClick = React.useCallback(() => {
    handleAddMessageClick();
    requestCompletions();
  }, []);

  const apiKeySnapshot = React.useSyncExternalStore(apiKeyStore.subscribe, () => apiKeyStore.get());

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
          title="Request Chat Completions"
          inverted
          disabled={!apiKeySnapshot.value}
          onClick={handleRequestCompletionsClick}
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

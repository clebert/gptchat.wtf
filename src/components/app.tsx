import {ApiKeyView} from './api-key-view.js';
import {AssistantModeButton} from './assistant-mode-button.js';
import {Button} from './button.js';
import {ColorSchemeButton} from './color-scheme-button.js';
import {CompletionsView} from './completions-view.js';
import {Icon} from './icon.js';
import {MessageView} from './message-view.js';
import {ModelButton} from './model-button.js';
import {NewMessageView} from './new-message-view.js';
import {StylesContext} from '../contexts/styles-context.js';
import {useClearDataCallback} from '../hooks/use-clear-data-callback.js';
import {useDarkMode} from '../hooks/use-dark-mode.js';
import {chatCompletions} from '../stores/chat-completions.js';
import {conversationStore} from '../stores/conversation-store.js';
import * as React from 'react';

export function App(): JSX.Element {
  const styles = React.useContext(StylesContext);

  React.useLayoutEffect(() => {
    document.querySelector(`body`)?.classList.add(...styles.background().split(` `));
  }, []);

  const darkMode = useDarkMode();

  React.useLayoutEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(`dark`);
    } else {
      document.documentElement.classList.remove(`dark`);
    }
  }, [darkMode]);

  const chatCompletionsSnapshot = React.useSyncExternalStore(chatCompletions.subscribe, () =>
    chatCompletions.get(),
  );

  const conversationSnapshot = React.useSyncExternalStore(conversationStore.subscribe, () =>
    conversationStore.get(),
  );

  const clearData = useClearDataCallback();

  return (
    <div className="2xl:container 2xl:mx-auto">
      <div className="m-2 flex flex-col space-y-2">
        <div className="flex space-x-2">
          <ModelButton />
          <AssistantModeButton />
          <ColorSchemeButton />
          <ApiKeyView />

          <Button title="Clear data" onClick={clearData}>
            <Icon type="arrowLeftOnRectangle" standalone />
          </Button>
        </div>

        {conversationSnapshot.value.messages.map((message) => (
          <MessageView key={message.messageId} message={message} />
        ))}

        {chatCompletionsSnapshot.state === `isInitialized` ? (
          <NewMessageView />
        ) : (
          <CompletionsView />
        )}
      </div>
    </div>
  );
}

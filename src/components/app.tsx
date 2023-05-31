import {ApiKeyView} from './api-key-view.js';
import {AssistantModeButton} from './assistant-mode-button.js';
import {Button} from './button.js';
import {ColorSchemeButton} from './color-scheme-button.js';
import {CompletionView} from './completion-view.js';
import {DiffMessageView} from './diff-message-view.js';
import {DiffModeButton} from './diff-mode-button.js';
import {Icon} from './icon.js';
import {MessageView} from './message-view.js';
import {ModelButton} from './model-button.js';
import {NewMessageView} from './new-message-view.js';
import {AppContext} from '../contexts/app-context.js';
import {StylesContext} from '../contexts/styles-context.js';
import {useClearDataCallback} from '../hooks/use-clear-data-callback.js';
import {useDarkMode} from '../hooks/use-dark-mode.js';
import {completionStore} from '../stores/completion-store.js';
import {conversationStore} from '../stores/conversation-store.js';
import {diffModeStore} from '../stores/diff-mode-store.js';
import {useStore} from '../wtfkit/use-store.js';
import * as React from 'react';
import {createRoot} from 'react-dom/client';
import 'tailwindcss/tailwind.css';

export function App(): JSX.Element {
  const styles = React.useContext(StylesContext);

  React.useLayoutEffect(() => {
    document
      .querySelector(`body`)
      ?.classList.add(...styles.background().split(` `));
  }, []);

  const darkMode = useDarkMode();

  React.useLayoutEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(`dark`);
    } else {
      document.documentElement.classList.remove(`dark`);
    }
  }, [darkMode]);

  const {getMessageStore} = React.useContext(AppContext);

  const completion = useStore(completionStore);
  const conversation = useStore(conversationStore);
  const diffMode = useStore(diffModeStore);
  const clearData = useClearDataCallback();

  let previousAssistantMessageId: string | undefined;

  return (
    <div className="2xl:container 2xl:mx-auto">
      <div className="m-2 flex flex-col space-y-2">
        <div className="flex space-x-2">
          <ModelButton />
          <AssistantModeButton />
          <DiffModeButton />
          <ColorSchemeButton />
          <ApiKeyView />

          <Button title="Clear data" onClick={clearData}>
            <Icon type="arrowLeftOnRectangle" standalone />
          </Button>
        </div>

        {conversation.value.messageIds.map((messageId) => {
          const message = getMessageStore(messageId).get();

          if (diffMode.state === `on` && message.role === `assistant`) {
            try {
              if (previousAssistantMessageId) {
                return (
                  <DiffMessageView
                    key={messageId}
                    originalMessageId={previousAssistantMessageId}
                    modifiedMessageId={messageId}
                  />
                );
              }
            } finally {
              previousAssistantMessageId = messageId;
            }
          }

          return <MessageView key={messageId} messageId={messageId} />;
        })}

        {completion.state === `idle` ? <NewMessageView /> : <CompletionView />}
      </div>
    </div>
  );
}

createRoot(document.querySelector(`main#app`)!).render(<App />);

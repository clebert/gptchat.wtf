import {ApiKeyView} from './api-key-view.js';
import {AssistantModeButton} from './assistant-mode-button.js';
import {Button} from './button.js';
import {ColorSchemeButton} from './color-scheme-button.js';
import {CompletionView} from './completion-view.js';
import {Icon} from './icon.js';
import {MessageView} from './message-view.js';
import {ModelButton} from './model-button.js';
import {NewMessageView} from './new-message-view.js';
import {AppContext} from '../contexts/app-context.js';
import {StylesContext} from '../contexts/styles-context.js';
import {useClearDataCallback} from '../hooks/use-clear-data-callback.js';
import {useDarkMode} from '../hooks/use-dark-mode.js';
import * as React from 'react';
import {createRoot} from 'react-dom/client';
import 'tailwindcss/tailwind.css';

export function App(): JSX.Element {
  const darkMode = useDarkMode();
  const styles = React.useContext(StylesContext);

  React.useLayoutEffect(() => {
    document
      .querySelector(`body`)
      ?.classList.add(...styles.background.split(` `));
  }, [styles]);

  React.useLayoutEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(`dark`);
    } else {
      document.documentElement.classList.remove(`dark`);
    }
  }, [darkMode]);

  const {completionStore, conversationStore} = React.useContext(AppContext);
  const completion = completionStore.use();
  const {messageIds} = conversationStore.use();
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

        {messageIds.map((id) => (
          <MessageView key={id} id={id} />
        ))}

        {completion.status === `idle` ? <NewMessageView /> : <CompletionView />}
      </div>
    </div>
  );
}

createRoot(document.querySelector(`main#app`)!).render(<App />);

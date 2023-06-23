import {ApiKeyView} from './api-key-view.js';
import {Button} from './button.js';
import {ColorSchemeButton} from './color-scheme-button.js';
import {CompletionsView} from './completions-view.js';
import {Headline} from './headline.js';
import {Icon} from './icon.js';
import {MessageView} from './message-view.js';
import {ModelButton} from './model-button.js';
import {NewMessageView} from './new-message-view.js';
import {StylesContext} from '../contexts/styles-context.js';
import {useDarkMode} from '../hooks/use-dark-mode.js';
import {apiKeyMachine} from '../machines/api-key-machine.js';
import {completionsMachine} from '../machines/completions-machine.js';
import {messagesMachine} from '../machines/messages-machine.js';
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

  const completionsSnapshot = React.useSyncExternalStore(completionsMachine.subscribe, () =>
    completionsMachine.get(),
  );

  const clearData = React.useCallback(() => {
    apiKeyMachine.get().actions.initialize(``);
    messagesMachine.get().actions.initialize([]);
  }, []);

  const {value: messages} = React.useSyncExternalStore(messagesMachine.subscribe, () =>
    messagesMachine.get(),
  );

  return (
    <div className="2xl:container 2xl:mx-auto">
      <div className="m-4 flex flex-col space-y-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="flex space-x-2">
            <Headline />
          </div>

          <div className="flex grow space-x-2">
            <ModelButton />
            <ColorSchemeButton />
            <ApiKeyView />

            <Button title="Clear data" onClick={clearData}>
              <Icon type="arrowLeftOnRectangle" standalone />
            </Button>
          </div>
        </div>

        {messages.map((message) => (
          <MessageView key={message.messageId} message={message} />
        ))}

        {completionsSnapshot.state === `isInitialized` ? <NewMessageView /> : <CompletionsView />}
      </div>
    </div>
  );
}

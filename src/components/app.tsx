import type {JSX} from 'preact';

import {ApiKeyView} from './api-key-view.js';
import {ColorSchemeButton} from './color-scheme-button.js';
import {CompletionView} from './completion-view.js';
import {MessageView} from './message-view.js';
import {ModelButton} from './model-button.js';
import {NewMessageView} from './new-message-view.js';
import {AppContext} from '../contexts/app-context.js';
import {StylesContext} from '../contexts/styles-context.js';
import {useDarkMode} from '../hooks/use-dark-mode.js';
import {render} from 'preact';
import {useContext, useLayoutEffect} from 'preact/hooks';
import 'tailwindcss/tailwind.css';

export function App(): JSX.Element {
  const darkMode = useDarkMode();
  const styles = useContext(StylesContext);

  useLayoutEffect(() => {
    document
      .querySelector(`body`)
      ?.classList.add(...styles.background.split(` `));
  }, [styles]);

  useLayoutEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(`dark`);
    } else {
      document.documentElement.classList.remove(`dark`);
    }
  }, [darkMode]);

  const {completionStore, conversationStore} = useContext(AppContext);
  const completion = completionStore.use();
  const {messageIds} = conversationStore.use();

  return (
    <div class="2xl:container 2xl:mx-auto">
      <div class="m-2 flex flex-col space-y-2">
        <div className="flex space-x-2">
          <ModelButton />
          <ApiKeyView />
          <ColorSchemeButton />
        </div>

        {messageIds.map((id) => (
          <MessageView key={id} id={id} />
        ))}

        {completion.status === `idle` ? <NewMessageView /> : <CompletionView />}
      </div>
    </div>
  );
}

render(<App />, document.querySelector(`main#app`)!);

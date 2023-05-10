import type {JSX} from 'preact';

import {ApiKeyField} from './api-key-field.js';
import {ChatCompletionView} from './chat-completion-view.js';
import {ChatHistoryEntryView} from './chat-history-entry-view.js';
import {ChatHistoryNewEntryView} from './chat-history-new-entry-view.js';
import {ColorSchemeButton} from './color-scheme-button.js';
import {ModelButton} from './model-button.js';
import {SystemMessageView} from './system-message-view.js';
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

  const {chatHistoryStore} = useContext(AppContext);
  const chatHistory = chatHistoryStore.useExternalState();

  return (
    <div class="2xl:container 2xl:mx-auto">
      <div class="m-2 flex flex-col space-y-2">
        <div className="flex space-x-2">
          <ColorSchemeButton />
          <ModelButton />
          <ApiKeyField />
        </div>

        <SystemMessageView />

        {chatHistory.map((entry) => (
          <ChatHistoryEntryView key={entry.id} entry={entry} />
        ))}

        <ChatCompletionView />
        <ChatHistoryNewEntryView />
      </div>
    </div>
  );
}

render(<App />, document.querySelector(`main#app`)!);

import * as React from 'react';
import { ColorSchemeButton, Container, Page, Styles, Topbar } from 'wtfkit';
import { ApiContext } from './lib/contexts/api-context.js';
import { ApiKeyView } from './lib/components/api-key-view.js';
import { CompletionsView } from './lib/components/completions-view.js';
import { MessageView } from './lib/components/message-view.js';
import { OpenaiModelButton } from './lib/components/openai-model-button.js';
import { PromptView } from './lib/components/prompt-view.js';
import { TemperatureButton } from './lib/components/temperature-button.js';
import { TopPButton } from './lib/components/top-p-button.js';
import { useChat } from './lib/hooks/use-chat.js';
import { useCompletions } from './lib/hooks/use-completions.js';
import { useOpenaiApi } from './lib/hooks/use-openai-api.js';

export function App(): JSX.Element {
  const styles = React.useMemo(() => new Styles({ neutralGray: true }), []);
  const chat = useChat();
  const completions = useCompletions();

  return (
    <ApiContext.Provider value={useOpenaiApi()}>
      <Page styles={styles}>
        <Topbar>
          <Container>
            <OpenaiModelButton />
            <TemperatureButton />
            <TopPButton />
          </Container>

          <Container grow>
            <Container grow>
              <ApiKeyView />
            </Container>

            <Container>
              <ColorSchemeButton />
            </Container>
          </Container>
        </Topbar>

        {chat.state !== `empty` &&
          chat.value.messages?.map((message) => (
            <MessageView key={message.uuid} chat={chat} message={message} />
          ))}

        {(chat.state === `empty` || chat.state === `responded`) && completions.state === `idle` && (
          <PromptView chat={chat} completions={completions} />
        )}

        {(completions.state === `fetching` || completions.state === `streaming`) && (
          <CompletionsView completions={completions} />
        )}
      </Page>
    </ApiContext.Provider>
  );
}

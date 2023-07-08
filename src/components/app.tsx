import {ApiKeyView} from './api-key-view.js';
import {CompletionsView} from './completions-view.js';
import {MessageView} from './message-view.js';
import {ModelButton} from './model-button.js';
import {NewMessageView} from './new-message-view.js';
import {apiKeyMachine} from '../machines/api-key-machine.js';
import {completionsMachine} from '../machines/completions-machine.js';
import {messagesMachine} from '../machines/messages-machine.js';
import * as React from 'react';
import {
  Button,
  ColorSchemeButton,
  Container,
  Icon,
  Page,
  Styles,
  Topbar,
  WtfHeadline,
  useToggle,
} from 'wtfkit';

export function App(): JSX.Element {
  const completionsSnapshot = React.useSyncExternalStore(completionsMachine.subscribe, () =>
    completionsMachine.get(),
  );

  const {value: messages} = React.useSyncExternalStore(messagesMachine.subscribe, () =>
    messagesMachine.get(),
  );

  const [chatDeletionRequested, requestChatDeletion] = useToggle(false, 3000);

  if (chatDeletionRequested && messages.length === 0) {
    requestChatDeletion();
  }

  const deleteChat = React.useMemo(
    () => (messages.length > 0 ? () => messagesMachine.get().actions.initialize([]) : undefined),
    [messages],
  );

  const {value: apiKey} = React.useSyncExternalStore(apiKeyMachine.subscribe, () =>
    apiKeyMachine.get(),
  );

  const [apiKeyVisible, toggleApiKeyVisibility] = useToggle(apiKey.length === 0);
  const styles = React.useMemo(() => new Styles({neutralGray: true}), []);

  return (
    <Page styles={styles}>
      <Topbar>
        <Container>
          <WtfHeadline subdomainName="gptchat" />
        </Container>

        <Container grow>
          <Container grow>
            <ModelButton />
            <ColorSchemeButton />

            <Button
              className="border-dashed"
              title={apiKeyVisible ? `API key visible` : `API key hidden`}
              disabled={apiKey.length === 0}
              onClick={toggleApiKeyVisibility}
            >
              <Icon type={apiKeyVisible ? `eye` : `eyeSlash`} standalone />
            </Button>

            {apiKeyVisible && <ApiKeyView />}
          </Container>

          <Container>
            {chatDeletionRequested ? (
              <Button title="Confirm chat deletion" onClick={deleteChat}>
                <Icon type="trash" />
                Delete chat
              </Button>
            ) : (
              <Button title="Delete chat" onClick={deleteChat && requestChatDeletion}>
                <Icon type="trash" standalone />
              </Button>
            )}
          </Container>
        </Container>
      </Topbar>

      {messages.map((message) => (
        <MessageView key={message.messageId} message={message} />
      ))}

      {completionsSnapshot.state === `isInitialized` ? <NewMessageView /> : <CompletionsView />}
    </Page>
  );
}

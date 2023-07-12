import type {Message} from '../machines/messages-machine.js';

import {Editor} from './editor.js';
import {MessageIcon} from './message-icon.js';
import {messagesMachine} from '../machines/messages-machine.js';
import debounce from 'lodash.debounce';
import * as monaco from 'monaco-editor';
import * as React from 'react';
import {Button, Container, Icon} from 'wtfkit';

export interface MessageViewProps {
  message: Message;
}

export function MessageView({message}: MessageViewProps): JSX.Element {
  const model = React.useMemo(() => monaco.editor.createModel(message.content, `markdown`), []);

  React.useEffect(() => {
    model.onDidChangeContent(
      debounce(() => {
        const messagesSnapshot = messagesMachine.get();

        messagesSnapshot.actions.initialize(
          messagesSnapshot.value.map((otherMessage) =>
            otherMessage.messageId === message.messageId
              ? {...otherMessage, content: model.getValue()}
              : otherMessage,
          ),
        );
      }, 500),
    );

    return () => {
      model.dispose();
    };
  }, []);

  const deleteMessage = React.useCallback(() => {
    const messagesSnapshot = messagesMachine.get();

    messagesSnapshot.actions.initialize(
      messagesSnapshot.value.filter((otherMessage) => otherMessage.messageId !== message.messageId),
    );
  }, []);

  return React.useMemo(
    () => (
      <Container>
        <Container col grow>
          <Editor model={model} autoScroll />
        </Container>

        <Container col>
          <Button title="Delete chat message" onClick={deleteMessage}>
            <Icon type="trash" standalone></Icon>
          </Button>

          <MessageIcon role={message.role} />
        </Container>
      </Container>
    ),
    [],
  );
}

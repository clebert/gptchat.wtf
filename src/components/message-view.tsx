import type {Message} from '../machines/messages-machine.js';

import {Button} from './button.js';
import {Editor} from './editor.js';
import {Icon} from './icon.js';
import {MessageRoleIcon} from './message-role-icon.js';
import {messagesMachine} from '../machines/messages-machine.js';
import debounce from 'lodash.debounce';
import * as monaco from 'monaco-editor';
import * as React from 'react';

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
      <div className="flex space-x-2">
        <div className="w-full overflow-hidden">
          <Editor model={model} autoScroll />
        </div>

        <div className="flex shrink-0 flex-col space-y-2">
          <Button title="Delete Chat Message" onClick={deleteMessage}>
            <Icon type="trash" standalone></Icon>
          </Button>

          <MessageRoleIcon role={message.role} />
        </div>
      </div>
    ),
    [],
  );
}

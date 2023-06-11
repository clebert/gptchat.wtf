import type {Message} from '../stores/create-conversation-store.js';

import {Button} from './button.js';
import {Editor} from './editor.js';
import {Icon} from './icon.js';
import {MessageRoleIcon} from './message-role-icon.js';
import {useDeleteMessageCallback} from '../hooks/use-delete-message-callback.js';
import {conversationStore} from '../stores/conversation-store.js';
import debounce from 'lodash.debounce';
import * as monaco from 'monaco-editor';
import * as React from 'react';

export interface MessageViewProps {
  message: Message;
}

export function MessageView({message}: MessageViewProps): JSX.Element {
  const deleteMessage = useDeleteMessageCallback();

  const handleDeleteMessageClick = React.useCallback(() => {
    deleteMessage(message.messageId);
  }, []);

  const model = React.useMemo(
    () => monaco.editor.createModel(message.content, `markdown`),
    [],
  );

  React.useEffect(() => {
    model.onDidChangeContent(
      debounce(() => {
        const conversationSnapshot = conversationStore.get();

        conversationSnapshot.actions.setMessages(
          conversationSnapshot.value.messages.map((otherMessage) =>
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

  return React.useMemo(
    () => (
      <div className="flex space-x-2">
        <div className="w-full overflow-hidden">
          <Editor model={model} autoScroll />
        </div>

        <div className="flex shrink-0 flex-col space-y-2">
          <Button
            title="Delete Chat Message"
            onClick={handleDeleteMessageClick}
          >
            <Icon type="trash" standalone></Icon>
          </Button>

          <MessageRoleIcon role={message.role} />
        </div>
      </div>
    ),
    [],
  );
}

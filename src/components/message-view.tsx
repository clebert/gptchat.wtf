import {Button} from './button.js';
import {Editor} from './editor.js';
import {Icon} from './icon.js';
import {MessageRoleIcon} from './message-role-icon.js';
import {AppContext} from '../contexts/app-context.js';
import {useDeleteMessageCallback} from '../hooks/use-delete-message-callback.js';
import * as React from 'react';

export interface MessageViewProps {
  messageId: string;
}

export function MessageView({messageId}: MessageViewProps): JSX.Element {
  const deleteMessage = useDeleteMessageCallback();

  const handleDeleteMessageClick = React.useCallback(() => {
    deleteMessage(messageId);
  }, [messageId, deleteMessage]);

  const {getMessageStore} = React.useContext(AppContext);
  const {role, model} = getMessageStore(messageId).use();

  return (
    <div className="flex space-x-2">
      <div className="w-full overflow-hidden">
        <Editor model={model} autoScroll />
      </div>

      <div className="flex shrink-0 flex-col space-y-2">
        <Button title="Delete Chat Message" onClick={handleDeleteMessageClick}>
          <Icon type="trash" standalone></Icon>
        </Button>

        <MessageRoleIcon role={role} />
      </div>
    </div>
  );
}

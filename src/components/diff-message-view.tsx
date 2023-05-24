import {Button} from './button.js';
import {DiffEditor} from './diff-editor.js';
import {Icon} from './icon.js';
import {MessageRoleIcon} from './message-role-icon.js';
import {AppContext} from '../contexts/app-context.js';
import {useDeleteMessageCallback} from '../hooks/use-delete-message-callback.js';
import * as React from 'react';

export interface DiffMessageViewProps {
  messageId1: string;
  messageId2: string;
}

export function DiffMessageView({
  messageId1,
  messageId2,
}: DiffMessageViewProps): JSX.Element {
  const deleteMessage = useDeleteMessageCallback();

  const handleDeleteMessageClick = React.useCallback(() => {
    deleteMessage(messageId2);
  }, [messageId2, deleteMessage]);

  const {getMessageStore} = React.useContext(AppContext);

  const {model: model1} = getMessageStore(messageId1).use();
  const {model: model2} = getMessageStore(messageId2).use();

  return (
    <div className="flex space-x-2">
      <div className="w-full overflow-hidden">
        <DiffEditor originalModel={model1} modifiedModel={model2} autoScroll />
      </div>

      <div className="flex shrink-0 flex-col space-y-2">
        <Button title="Delete Chat Message" onClick={handleDeleteMessageClick}>
          <Icon type="trash" standalone></Icon>
        </Button>

        <MessageRoleIcon role="assistant" />
      </div>
    </div>
  );
}

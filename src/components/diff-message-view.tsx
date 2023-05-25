import {Button} from './button.js';
import {DiffEditor} from './diff-editor.js';
import {Icon} from './icon.js';
import {MessageRoleIcon} from './message-role-icon.js';
import {AppContext} from '../contexts/app-context.js';
import {useDeleteMessageCallback} from '../hooks/use-delete-message-callback.js';
import * as React from 'react';

export interface DiffMessageViewProps {
  originalMessageId: string;
  modifiedMessageId: string;
}

export function DiffMessageView({
  originalMessageId,
  modifiedMessageId,
}: DiffMessageViewProps): JSX.Element {
  const deleteMessage = useDeleteMessageCallback();

  const handleDeleteMessageClick = React.useCallback(() => {
    deleteMessage(modifiedMessageId);
  }, [modifiedMessageId, deleteMessage]);

  const {getMessageStore} = React.useContext(AppContext);

  const {model: originalModel} = getMessageStore(originalMessageId).use();
  const {model: modifiedModel} = getMessageStore(modifiedMessageId).use();

  return (
    <div className="flex space-x-2">
      <div className="w-full overflow-hidden">
        <DiffEditor
          originalModel={originalModel}
          modifiedModel={modifiedModel}
          autoScroll
        />
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

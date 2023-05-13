import type {JSX} from 'preact';

import {Button} from './button.js';
import {Editor} from './editor.js';
import {Icon} from './icon.js';
import {MessageRoleIcon} from './message-role-icon.js';
import {AppContext} from '../contexts/app-context.js';
import {useDeleteMessageCallback} from '../hooks/use-delete-message-callback.js';
import {useCallback, useContext} from 'preact/hooks';

export interface MessageViewProps {
  id: string;
}

export function MessageView({id}: MessageViewProps): JSX.Element {
  const deleteMessage = useDeleteMessageCallback();

  const handleDeleteMessageClick = useCallback(() => {
    deleteMessage(id);
  }, [id, deleteMessage]);

  const {getMessageStore} = useContext(AppContext);
  const {role, model} = getMessageStore(id).use();

  return (
    <div className="flex space-x-2">
      <div class="w-full overflow-hidden">
        <Editor model={model} />
      </div>

      <div class="flex shrink-0 flex-col space-y-2">
        <Button title="Delete Chat Message" onClick={handleDeleteMessageClick}>
          <Icon type="trash" standalone></Icon>
        </Button>

        {role && <MessageRoleIcon role={role} />}
      </div>
    </div>
  );
}

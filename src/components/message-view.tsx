import {Button} from './button.js';
import {Editor} from './editor.js';
import {Icon} from './icon.js';
import {MessageRoleIcon} from './message-role-icon.js';
import {useDeleteMessageCallback} from '../hooks/use-delete-message-callback.js';
import {useStore} from '../hooks/use-store.js';
import {messageStoreRegistry} from '../stores/message-store-registry.js';
import debounce from 'lodash.debounce';
import * as monaco from 'monaco-editor';
import * as React from 'react';

export interface MessageViewProps {
  messageId: string;
}

export function MessageView({messageId}: MessageViewProps): JSX.Element {
  const deleteMessage = useDeleteMessageCallback();

  const handleDeleteMessageClick = React.useCallback(() => {
    deleteMessage(messageId);
  }, []);

  const messageStore = React.useMemo(
    () => messageStoreRegistry.get(messageId),
    [],
  );

  const model = React.useMemo(
    () =>
      monaco.editor.createModel(messageStore.get().value.content, `markdown`),
    [],
  );

  React.useEffect(() => {
    model.onDidChangeContent(
      debounce(() => {
        messageStore.get().actions.set({
          ...messageStore.get().value,
          content: model.getValue(),
        });
      }, 500),
    );

    return () => {
      model.dispose();
    };
  }, []);

  const messageSnapshot = useStore(messageStore);

  return (
    <div className="flex space-x-2">
      <div className="w-full overflow-hidden">
        <Editor model={model} autoScroll />
      </div>

      <div className="flex shrink-0 flex-col space-y-2">
        <Button title="Delete Chat Message" onClick={handleDeleteMessageClick}>
          <Icon type="trash" standalone></Icon>
        </Button>

        <MessageRoleIcon role={messageSnapshot.value.role} />
      </div>
    </div>
  );
}

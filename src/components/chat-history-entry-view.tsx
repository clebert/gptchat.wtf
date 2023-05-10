import type {ChatMessageRole} from '../apis/create-chat-event-stream.js';
import type {ChatHistoryEntry} from '../contexts/app-context.js';
import type {JSX} from 'preact';

import {Editor} from './editor.js';
import {RoleButton} from './role-button.js';
import {AppContext} from '../contexts/app-context.js';
import {Button} from '../core-components/button.js';
import {Icon} from '../core-components/icon.js';
import debounce from 'lodash.debounce';
import * as monaco from 'monaco-editor';
import {useCallback, useContext, useEffect, useMemo} from 'preact/hooks';

export interface ChatHistoryEntryViewProps {
  entry: ChatHistoryEntry;
}

export function ChatHistoryEntryView({
  entry,
}: ChatHistoryEntryViewProps): JSX.Element {
  const model = useMemo(
    () => monaco.editor.createModel(entry.content, `markdown`),
    [],
  );

  const {chatHistoryStore} = useContext(AppContext);

  useEffect(() => {
    model.onDidChangeContent(
      debounce(() => {
        chatHistoryStore.set(
          chatHistoryStore
            .get()
            .map((otherEntry) =>
              otherEntry.id === entry.id
                ? {...otherEntry, content: model.getValue()}
                : otherEntry,
            ),
        );
      }, 500),
    );

    return () => model.dispose();
  }, []);

  const deleteEntry = useCallback(() => {
    chatHistoryStore.set(
      chatHistoryStore.get().filter(({id}) => id !== entry.id),
    );
  }, [entry.id]);

  const setRole = useCallback(
    (newRole: ChatMessageRole) => {
      chatHistoryStore.set(
        chatHistoryStore
          .get()
          .map((otherMessage) =>
            otherMessage.id === entry.id
              ? {...otherMessage, role: newRole}
              : otherMessage,
          ),
      );
    },
    [entry.id],
  );

  return (
    <div className="flex space-x-2">
      <div class="flex shrink-0 flex-col space-y-2">
        <RoleButton role={entry.role} onToggle={setRole} />

        <Button title="Delete" onClick={deleteEntry}>
          <Icon type="trash" standalone></Icon>
        </Button>
      </div>

      <div class="w-full overflow-hidden">
        <Editor model={model} />
      </div>
    </div>
  );
}

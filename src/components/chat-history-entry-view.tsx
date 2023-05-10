import type {ChatHistoryEntry} from '../contexts/app-context.js';
import type {JSX} from 'preact';

import {Button} from './button.js';
import {Editor} from './editor.js';
import {Icon} from './icon.js';
import {RoleIcon} from './role-icon.js';
import {AppContext} from '../contexts/app-context.js';
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

  return (
    <div className="flex space-x-2">
      <div class="flex shrink-0 flex-col space-y-2">
        <Button title="Delete" onClick={deleteEntry}>
          <Icon type="trash" standalone></Icon>
        </Button>

        <RoleIcon role={entry.role} />
      </div>

      <div class="w-full overflow-hidden">
        <Editor model={model} />
      </div>
    </div>
  );
}

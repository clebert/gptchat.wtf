import type {ChatMessageRole} from '../apis/create-chat-event-stream.js';
import type {JSX} from 'preact';

import {ChatCompletionSendButton} from './chat-completion-send-button.js';
import {Editor} from './editor.js';
import {RoleButton} from './role-button.js';
import {AppContext} from '../contexts/app-context.js';
import {Button} from '../core-components/button.js';
import {Icon} from '../core-components/icon.js';
import * as monaco from 'monaco-editor';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';

export function ChatHistoryNewEntryView(): JSX.Element {
  const model = useMemo(() => monaco.editor.createModel(``, `markdown`), []);

  useEffect(() => () => model.dispose(), []);

  const [role, setRole] = useState<ChatMessageRole>(`user`);
  const {chatCompletionStore, chatHistoryStore} = useContext(AppContext);

  const addEntry = useCallback(() => {
    if (model.getValue()) {
      chatHistoryStore.set([
        ...chatHistoryStore.get(),
        {id: crypto.randomUUID(), role, content: model.getValue()},
      ]);

      model.setValue(``);
      setRole(`user`);
    }
  }, [role]);

  const chatCompletion = chatCompletionStore.useExternalState();

  return chatCompletion.status === `idle` ? (
    <div className="flex space-x-2">
      <div class="flex shrink-0 flex-col space-y-2">
        <ChatCompletionSendButton onBeforeSend={addEntry} />

        <Button title="Add entry" onClick={addEntry}>
          <Icon type="plus" standalone></Icon>
        </Button>

        <RoleButton role={role} onToggle={setRole} />
      </div>

      <div class="w-full overflow-hidden">
        <Editor model={model} />
      </div>
    </div>
  ) : (
    <></>
  );
}

import type {JSX} from 'preact';

import {Button} from './button.js';
import {ChatCompletionSendButton} from './chat-completion-send-button.js';
import {Editor} from './editor.js';
import {Icon} from './icon.js';
import {RoleIcon} from './role-icon.js';
import {AppContext} from '../contexts/app-context.js';
import * as monaco from 'monaco-editor';
import {useCallback, useContext, useEffect, useMemo} from 'preact/hooks';

export function ChatHistoryNewEntryView(): JSX.Element {
  const model = useMemo(() => monaco.editor.createModel(``, `markdown`), []);

  useEffect(() => () => model.dispose(), []);

  const {chatCompletionStore, chatHistoryStore} = useContext(AppContext);

  const addEntry = useCallback(() => {
    if (model.getValue()) {
      chatHistoryStore.set([
        ...chatHistoryStore.get(),
        {id: crypto.randomUUID(), role: `user`, content: model.getValue()},
      ]);

      model.setValue(``);
    }
  }, []);

  const chatCompletion = chatCompletionStore.useExternalState();

  useEffect(() => {
    if (chatCompletion.status === `idle`) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [chatCompletion.status]);

  return chatCompletion.status === `idle` ? (
    <div className="flex space-x-2">
      <div class="flex shrink-0 flex-col space-y-2">
        <ChatCompletionSendButton onBeforeSend={addEntry} />

        <Button title="Add entry" onClick={addEntry}>
          <Icon type="plus" standalone></Icon>
        </Button>

        <RoleIcon role="user" />
      </div>

      <div class="w-full overflow-hidden">
        <Editor class="h-40" model={model} />
      </div>
    </div>
  ) : (
    <></>
  );
}

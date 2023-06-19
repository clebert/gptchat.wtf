import {Button} from './button.js';
import {Editor} from './editor.js';
import {Icon} from './icon.js';
import {MessageRoleIcon} from './message-role-icon.js';
import {apiKeyMachine} from '../machines/api-key-machine.js';
import {completionsMachine} from '../machines/completions-machine.js';
import {gptModelMachine} from '../machines/gpt-model-machine.js';
import {messagesMachine} from '../machines/messages-machine.js';
import {isTouchDevice} from '../utils/is-touch-device.js';
import * as monaco from 'monaco-editor';
import * as React from 'react';

export function NewMessageView(): JSX.Element {
  const model = React.useMemo(() => monaco.editor.createModel(``, `markdown`), []);

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setTimeout(() => {
      const {scrollTop} = document.documentElement;
      const {top} = containerRef.current!.getBoundingClientRect();

      window.scrollTo({top: scrollTop + top});
    }, 0);

    return () => {
      model.dispose();
    };
  }, []);

  const content = React.useSyncExternalStore(
    (listener) => {
      const {dispose} = model.onDidChangeContent(listener);

      return dispose;
    },
    () => model.getValue(),
  );

  const messagesSnapshot = React.useSyncExternalStore(messagesMachine.subscribe, () =>
    messagesMachine.get(),
  );

  const addMessage = React.useMemo(
    () =>
      content.length > 0
        ? () => {
            messagesSnapshot.actions.initialize([
              ...messagesSnapshot.value,
              {messageId: crypto.randomUUID(), role: `user`, content},
            ]);

            model.setValue(``);
          }
        : undefined,
    [content, messagesSnapshot],
  );

  const completionsSnapshot = React.useSyncExternalStore(completionsMachine.subscribe, () =>
    completionsMachine.get(),
  );

  const requestCompletions = React.useMemo(() => {
    return (addMessage || messagesSnapshot.value.length > 0) &&
      completionsSnapshot.state === `isInitialized`
      ? () => {
          addMessage?.();

          const [message, ...otherMessages] = messagesMachine.get().value.map((otherMessage) => ({
            role: otherMessage.role,
            content: otherMessage.content,
          }));

          completionsSnapshot.actions.send({
            apiKey: apiKeyMachine.get().value,
            model: gptModelMachine.get().state === `isGpt4` ? `gpt-4` : `gpt-3.5-turbo`,
            messages: [message!, ...otherMessages],
          });
        }
      : undefined;
  }, [addMessage, messagesSnapshot, completionsSnapshot]);

  const {value: apiKey} = React.useSyncExternalStore(apiKeyMachine.subscribe, () =>
    apiKeyMachine.get(),
  );

  return (
    <div ref={containerRef} className="flex space-x-2">
      <div className="w-full overflow-hidden">
        <Editor model={model} autoFocus={apiKey.length > 0 && !isTouchDevice()} autoScroll />
      </div>

      <div className="flex shrink-0 flex-col space-y-2">
        <Button title="Request Chat Completions" inverted onClick={requestCompletions}>
          <Icon type="paperAirplane" standalone />
        </Button>

        <Button title="Add Chat Message" onClick={addMessage}>
          <Icon type="plus" standalone />
        </Button>

        <MessageRoleIcon role="user" />
      </div>
    </div>
  );
}

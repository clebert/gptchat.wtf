import type {JSX} from 'preact';

import {AppContext} from '../contexts/app-context.js';
import {Button} from '../core-components/button.js';
import {Icon} from '../core-components/icon.js';
import {useSyncExternalStore} from 'preact/compat';
import {useCallback, useContext} from 'preact/hooks';

export function ChatCompletionCancelButton(): JSX.Element {
  const {chatCompletionStore} = useContext(AppContext);

  const chatCompletion = useSyncExternalStore(
    chatCompletionStore.subscribe,
    chatCompletionStore.getSnapshot,
  );

  const cancelChat = useCallback(() => {
    if (chatCompletion.status !== `idle`) {
      chatCompletionStore.publish({status: `idle`});
    }
  }, [chatCompletion]);

  return (
    <Button
      title="Cancel chat completion"
      disabled={chatCompletion.status === `idle`}
      onClick={cancelChat}
    >
      <Icon type="xMark" standalone />
    </Button>
  );
}

import type {JSX} from 'preact';

import {AppContext} from '../contexts/app-context.js';
import {Button} from '../core-components/button.js';
import {Icon} from '../core-components/icon.js';
import {useCallback, useContext} from 'preact/hooks';

export function ChatCompletionCancelButton(): JSX.Element {
  const {chatCompletionStore} = useContext(AppContext);
  const chatCompletion = chatCompletionStore.useExternalState();

  const cancelChat = useCallback(() => {
    if (chatCompletion.status !== `idle`) {
      chatCompletionStore.set({status: `idle`});
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

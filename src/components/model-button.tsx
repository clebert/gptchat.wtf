import type {JSX} from 'preact';

import {Button} from './button.js';
import {AppContext} from '../contexts/app-context.js';
import {useCallback, useContext} from 'preact/hooks';

const titles = {'gpt-4': `GPT-4`, 'gpt-3.5-turbo': `GPT-3.5 Turbo`};

export function ModelButton(): JSX.Element {
  const {modelStore} = useContext(AppContext);
  const model = modelStore.useExternalState();

  const toggleModel = useCallback(() => {
    if (model === `gpt-4`) {
      modelStore.set(`gpt-3.5-turbo`);
    } else {
      modelStore.set(`gpt-4`);
    }
  }, [model]);

  return (
    <Button class="border-dashed" title={titles[model]} onClick={toggleModel}>
      {titles[model]}
    </Button>
  );
}

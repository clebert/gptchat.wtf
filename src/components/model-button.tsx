import type {JSX} from 'preact';

import {Button} from './button.js';
import {AppContext} from '../contexts/app-context.js';
import {useToggleModelCallback} from '../hooks/use-toggle-model-callback.js';
import {useContext} from 'preact/hooks';

const titles = {'gpt-4': `GPT-4`, 'gpt-3.5-turbo': `GPT-3.5 Turbo`};

export function ModelButton(): JSX.Element {
  const toggleModel = useToggleModelCallback();
  const {modelStore} = useContext(AppContext);
  const model = modelStore.use();

  return (
    <Button class="border-dashed" title={titles[model]} onClick={toggleModel}>
      {titles[model]}
    </Button>
  );
}

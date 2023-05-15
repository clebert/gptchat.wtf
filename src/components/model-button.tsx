import {Button} from './button.js';
import {AppContext} from '../contexts/app-context.js';
import {useToggleModelCallback} from '../hooks/use-toggle-model-callback.js';
import * as React from 'react';

const titles = {'gpt-4': `GPT-4`, 'gpt-3.5-turbo': `GPT-3.5 Turbo`};

export function ModelButton(): JSX.Element {
  const toggleModel = useToggleModelCallback();
  const {modelStore} = React.useContext(AppContext);
  const model = modelStore.use();

  return (
    <Button
      className="border-dashed"
      title={titles[model]}
      onClick={toggleModel}
    >
      {titles[model]}
    </Button>
  );
}

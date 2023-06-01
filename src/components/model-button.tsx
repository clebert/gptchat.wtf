import {Button} from './button.js';
import {modelStore} from '../stores/model-store.js';
import {useStore} from '../wtfkit/use-store.js';
import * as React from 'react';

const titles = {'gpt-4': `GPT-4`, 'gpt-3.5-turbo': `GPT-3.5 Turbo`};

export function ModelButton(): JSX.Element {
  const modelSnapshot = useStore(modelStore);

  const toggle = React.useCallback(() => {
    modelStore.get().actions.toggle();
  }, []);

  return (
    <Button
      className="border-dashed"
      title={titles[modelSnapshot.state]}
      onClick={toggle}
    >
      {titles[modelSnapshot.state]}
    </Button>
  );
}

import type {JSX} from 'preact';

import {AppContext} from '../contexts/app-context.js';
import {Button} from '../core-components/button.js';
import {useSyncExternalStore} from 'preact/compat';
import {useCallback, useContext} from 'preact/hooks';

const titles = {'gpt-4': `GPT-4`, 'gpt-3.5-turbo': `GPT-3.5 Turbo`};

export function ModelButton(): JSX.Element {
  const {modelStore} = useContext(AppContext);

  const model = useSyncExternalStore(
    modelStore.subscribe,
    modelStore.getSnapshot,
  );

  const toggleModel = useCallback(() => {
    if (model === `gpt-4`) {
      modelStore.publish(`gpt-3.5-turbo`);
    } else {
      modelStore.publish(`gpt-4`);
    }
  }, [model]);

  return (
    <Button class="border-dashed" title={titles[model]} onClick={toggleModel}>
      {titles[model]}
    </Button>
  );
}

import {gptModelMachine} from '../machines/gpt-model-machine.js';
import * as React from 'react';
import {Button} from 'wtfkit';

const titles = {isGpt4: `GPT-4`, isGpt35Turbo: `GPT-3.5 Turbo`};

export function ModelButton(): JSX.Element {
  const {state: gptModel} = React.useSyncExternalStore(gptModelMachine.subscribe, () =>
    gptModelMachine.get(),
  );

  const toggle = React.useCallback(() => {
    gptModelMachine.get().actions.toggle();
  }, []);

  return (
    <Button className="border-dashed" title={titles[gptModel]} onClick={toggle}>
      {titles[gptModel]}
    </Button>
  );
}

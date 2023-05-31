import {Button} from './button.js';
import {Icon} from './icon.js';
import {assistantModeStore} from '../stores/assistant-mode-store.js';
import {useStore} from '../wtfkit/use-store.js';
import * as React from 'react';

const titles = {
  general: `General Assistant`,
  programming: `Programming Assistant`,
};

const iconTypes = {
  general: `chatBubbleLeftRight`,
  programming: `codeBracket`,
} as const;

export function AssistantModeButton(): JSX.Element {
  const assistantMode = useStore(assistantModeStore);

  const toggle = React.useCallback(() => {
    assistantModeStore.get().actions.toggle();
  }, []);

  return (
    <Button
      className="border-dashed"
      title={titles[assistantMode.state]}
      onClick={toggle}
    >
      <Icon type={iconTypes[assistantMode.state]} standalone />
    </Button>
  );
}

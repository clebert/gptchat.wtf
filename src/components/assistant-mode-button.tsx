import {Button} from './button.js';
import {Icon} from './icon.js';
import {AppContext} from '../contexts/app-context.js';
import {useToggleAssistantModeCallback} from '../hooks/use-toggle-assistant-mode-callback.js';
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
  const toggleAssistantMode = useToggleAssistantModeCallback();
  const {assistantModeStore} = React.useContext(AppContext);
  const mode = assistantModeStore.use();

  return (
    <Button
      className="border-dashed"
      title={titles[mode]}
      onClick={toggleAssistantMode}
    >
      <Icon type={iconTypes[mode]} standalone />
    </Button>
  );
}

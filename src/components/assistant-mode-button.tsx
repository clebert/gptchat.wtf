import type {JSX} from 'preact';

import {Button} from './button.js';
import {Icon} from './icon.js';
import {AppContext} from '../contexts/app-context.js';
import {useToggleAssistantModeCallback} from '../hooks/use-toggle-assistant-mode-callback.js';
import {useContext} from 'preact/hooks';

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
  const {assistantModeStore} = useContext(AppContext);
  const mode = assistantModeStore.use();

  return (
    <Button
      class="border-dashed"
      title={titles[mode]}
      onClick={toggleAssistantMode}
    >
      <Icon type={iconTypes[mode]} standalone />
    </Button>
  );
}

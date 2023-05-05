import type {ChatMessageRole} from '../apis/create-chat-event-stream.js';
import type {JSX} from 'preact';

import {Button} from '../core-components/button.js';
import {Icon} from '../core-components/icon.js';
import {useCallback} from 'preact/hooks';

export interface RoleButtonProps {
  role: ChatMessageRole;

  onToggle(newRole: ChatMessageRole): void;
}

const titles = {
  system: `System role`,
  user: `User role`,
  assistant: `Assistant role`,
};

const iconTypes = {
  system: `adjustmentsHorizontal`,
  user: `user`,
  assistant: `chatBubbleLeftEllipsis`,
} as const;

export function RoleButton({role, onToggle}: RoleButtonProps): JSX.Element {
  const toggleRole = useCallback(() => {
    if (role === `system`) {
      onToggle(`user`);
    } else if (role === `user`) {
      onToggle(`assistant`);
    } else {
      onToggle(`system`);
    }
  }, [role]);

  return (
    <Button class="border-dashed" title={titles[role]} onClick={toggleRole}>
      <Icon type={iconTypes[role]} standalone />
    </Button>
  );
}

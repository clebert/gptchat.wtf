import type {ChatMessageRole} from '../apis/create-chat-event-stream.js';
import type {JSX} from 'preact';

import {Icon} from './icon.js';
import {StylesContext} from '../contexts/styles-context.js';
import {join} from '../utils/join.js';
import {useContext} from 'preact/hooks';

export interface RoleIconProps {
  role: ChatMessageRole;
}

const titles = {system: `System`, user: `User`, assistant: `Assistant`};

const iconTypes = {
  system: `adjustmentsHorizontal`,
  user: `user`,
  assistant: `chatBubbleLeftEllipsis`,
} as const;

export function RoleIcon({role}: RoleIconProps): JSX.Element {
  const styles = useContext(StylesContext);

  return (
    <div
      class={join(
        `flex select-none items-center border-hidden px-2`,
        styles.text,
        styles.background,
      )}
      title={titles[role]}
    >
      <Icon type={iconTypes[role]} standalone />
    </div>
  );
}

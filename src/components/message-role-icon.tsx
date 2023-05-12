import type {JSX} from 'preact';

import {Icon} from './icon.js';
import {StylesContext} from '../contexts/styles-context.js';
import {join} from '../utils/join.js';
import {useContext} from 'preact/hooks';

export interface MessageRoleIconProps {
  role: 'user' | 'assistant';
}

const titles = {user: `User`, assistant: `Assistant`};

const iconTypes = {
  user: `user`,
  assistant: `chatBubbleLeftEllipsis`,
} as const;

export function MessageRoleIcon({role}: MessageRoleIconProps): JSX.Element {
  const styles = useContext(StylesContext);

  return (
    <div
      class={join(
        `flex select-none items-center px-2`,
        styles.text,
        styles.background,
        styles.borderTransparent,
      )}
      title={titles[role]}
    >
      <Icon type={iconTypes[role]} standalone />
    </div>
  );
}

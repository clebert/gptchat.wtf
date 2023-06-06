import {Icon} from './icon.js';
import {StylesContext} from '../contexts/styles-context.js';
import {joinClassNames} from '../utils/join-class-names.js';
import * as React from 'react';

export interface MessageRoleIconProps {
  role: 'user' | 'assistant';
}

const titles = {user: `User`, assistant: `Assistant`};

const iconTypes = {
  user: `user`,
  assistant: `chatBubbleLeftEllipsis`,
} as const;

export function MessageRoleIcon({role}: MessageRoleIconProps): JSX.Element {
  const styles = React.useContext(StylesContext);

  return (
    <div
      className={joinClassNames(
        `flex select-none items-center px-2`,
        styles.background(),
        styles.border({transparent: true}),
        styles.text(),
      )}
      title={titles[role]}
    >
      <Icon type={iconTypes[role]} standalone />
    </div>
  );
}

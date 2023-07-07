import * as React from 'react';
import {Icon, Styles, joinClassNames} from 'wtfkit';

export interface MessageRoleIconProps {
  role: 'assistant' | 'user' | 'system';
}

const titles = {assistant: `Assistant`, user: `User`, system: `System`};

const iconTypes = {
  user: `user`,
  assistant: `chatBubbleLeftEllipsis`,
  system: `adjustmentsHorizontal`,
} as const;

export function MessageRoleIcon({role}: MessageRoleIconProps): JSX.Element {
  const styles = React.useContext(Styles.Context);

  return (
    <div
      className={joinClassNames(
        `select-none px-2`,
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

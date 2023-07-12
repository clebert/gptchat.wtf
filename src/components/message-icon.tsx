import * as React from 'react';
import {Icon, Styles, joinClassNames} from 'wtfkit';

export interface MessageIconProps {
  role: 'assistant' | 'user' | 'system';
}

const titles = {assistant: `Assistant`, user: `User`, system: `System`};

const iconTypes = {
  assistant: `chatBubbleLeftEllipsis`,
  user: `user`,
  system: `adjustmentsHorizontal`,
} as const;

export function MessageIcon({role}: MessageIconProps): JSX.Element {
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

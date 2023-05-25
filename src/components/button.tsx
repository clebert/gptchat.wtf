import {StylesContext} from '../contexts/styles-context.js';
import {joinClassNames} from '../wtfkit/join-class-names.js';
import * as React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit';
  title: string;
  disabled?: boolean;
  inverted?: boolean;

  onClick?(): void;
}

export function Button({
  children,
  className,
  type = `button`,
  title,
  disabled,
  inverted,
  onClick,
}: ButtonProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const enabled = disabled === undefined ? onClick !== undefined : !disabled;

  return (
    <button
      className={joinClassNames(
        className,
        `flex select-none items-center whitespace-nowrap px-2`,
        !enabled && `cursor-default opacity-25`,
        styles.background({active: enabled, inverted}),
        styles.border({transparent: inverted}),
        styles.focus(),
        styles.text({active: enabled, inverted}),
      )}
      type={type}
      title={title}
      aria-label={title}
      disabled={!enabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

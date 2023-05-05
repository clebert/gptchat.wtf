import type {ComponentChildren, JSX} from 'preact';

import {StylesContext} from '../contexts/styles-context.js';
import {join} from '../utils/join.js';
import {useContext} from 'preact/hooks';

export interface ButtonProps {
  children: ComponentChildren;
  class?: string;
  type?: 'button' | 'submit';
  title: string;
  disabled?: boolean;

  onClick?(): void;
}

export function Button({
  children,
  class: className,
  type = `button`,
  title,
  disabled,
  onClick,
}: ButtonProps): JSX.Element {
  const styles = useContext(StylesContext);
  const enabled = disabled === undefined ? onClick !== undefined : !disabled;

  return (
    <button
      class={join(
        className,
        `flex select-none items-center whitespace-nowrap px-2`,
        !enabled && `cursor-default opacity-25`,
        styles.text,
        styles.background,
        styles.border,
        enabled && styles.textActive,
        enabled && styles.backgroundActive,
        enabled && styles.focus,
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

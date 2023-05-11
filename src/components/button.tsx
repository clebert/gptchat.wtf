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
  inverted?: boolean;

  onClick?(): void;
}

export function Button({
  children,
  class: className,
  type = `button`,
  title,
  disabled,
  inverted,
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
        inverted ? styles.textInverted : styles.text,
        inverted ? styles.backgroundInverted : styles.background,
        inverted ? styles.borderTransparent : styles.border,
        enabled && (inverted ? styles.textInvertedActive : styles.textActive),
        enabled &&
          (inverted
            ? styles.backgroundInvertedActive
            : styles.backgroundActive),
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

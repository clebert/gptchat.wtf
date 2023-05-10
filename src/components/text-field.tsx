import type {JSX} from 'preact';

import {StylesContext} from '../contexts/styles-context.js';
import {join} from '../utils/join.js';
import {useCallback, useContext, useEffect, useRef} from 'preact/hooks';

export interface TextFieldProps {
  class?: string;
  type?: `text` | 'password';
  value: string;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  required?: boolean;

  onInput(value: string): void;
}

export function TextField({
  class: className,
  type = `text`,
  value,
  placeholder,
  autoFocus,
  disabled,
  required,
  onInput,
}: TextFieldProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, []);

  const handleInput = useCallback(
    (event: Event) => {
      event.preventDefault();
      onInput((event.target as HTMLInputElement).value);
    },
    [onInput],
  );

  const styles = useContext(StylesContext);

  return (
    <input
      ref={inputRef}
      class={join(
        className,
        `w-full appearance-none rounded-none px-2`,
        disabled && `opacity-25`,
        styles.text,
        styles.textPlaceholder,
        styles.background,
        styles.border,
        !disabled && styles.focus,
      )}
      type={type}
      value={value}
      placeholder={placeholder}
      autocomplete="off"
      autocorrect="off"
      disabled={disabled}
      required={required}
      spellcheck={false}
      onInput={handleInput}
    />
  );
}

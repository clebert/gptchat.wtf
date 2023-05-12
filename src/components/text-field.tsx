import type {JSX} from 'preact';
import type {ForwardedRef} from 'preact/compat';

import {StylesContext} from '../contexts/styles-context.js';
import {join} from '../utils/join.js';
import {forwardRef} from 'preact/compat';
import {useCallback, useContext} from 'preact/hooks';

export interface TextFieldProps {
  class?: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;

  onInput(value: string): void;
}

export const TextField = forwardRef(
  (
    {
      class: className,
      value,
      placeholder,
      disabled,
      required,
      onInput,
    }: TextFieldProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): JSX.Element => {
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
        ref={ref}
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
        type="text"
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
  },
);

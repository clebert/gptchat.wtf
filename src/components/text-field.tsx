import {StylesContext} from '../contexts/styles-context.js';
import {join} from '../utils/join.js';
import * as React from 'react';

export interface TextFieldProps {
  className?: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;

  onInput(value: string): void;
}

export const TextField = React.forwardRef(
  (
    {
      className,
      value,
      placeholder,
      disabled,
      required,
      onInput,
    }: TextFieldProps,
    ref: React.ForwardedRef<HTMLInputElement>,
  ): JSX.Element => {
    const handleInput = React.useCallback<
      React.FormEventHandler<HTMLInputElement>
    >(
      (event) => {
        event.preventDefault();
        onInput(event.currentTarget.value);
      },
      [onInput],
    );

    const styles = React.useContext(StylesContext);

    return (
      <input
        ref={ref}
        className={join(
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
        autoComplete="off"
        autoCorrect="off"
        disabled={disabled}
        required={required}
        spellCheck={false}
        onInput={handleInput}
      />
    );
  },
);

import {joinClassNames} from '../utils/join-class-names.js';
import * as React from 'react';

export interface Styles {
  background(options?: {
    readonly active?: boolean;
    readonly inverted?: boolean;
  }): string;

  border(options?: {readonly transparent?: boolean}): string;
  focus(options?: {readonly within?: boolean}): string;

  text(options?: {
    readonly active?: boolean;
    readonly inverted?: boolean;
    readonly placeholder?: boolean;
  }): string;
}

export const StylesContext = React.createContext<Styles>({
  background({active, inverted} = {}) {
    return joinClassNames(
      active &&
        (inverted
          ? `active:bg-white dark:active:bg-neutral-900`
          : `active:bg-neutral-900 dark:active:bg-white`),
      inverted
        ? `bg-neutral-900 dark:bg-white`
        : `bg-white dark:bg-neutral-900`,
    );
  },

  border({transparent} = {}) {
    return transparent
      ? `border border-transparent`
      : `border border-neutral-300 dark:border-neutral-700`;
  },

  focus({within} = {}) {
    return within
      ? `focus-within:outline focus-within:outline-1 focus-within:outline-offset-[-1px] focus-within:outline-blue-400`
      : `focus:outline focus:outline-1 focus:outline-offset-[-1px] focus:outline-blue-400`;
  },

  text({active, inverted, placeholder} = {}) {
    return joinClassNames(
      active &&
        (inverted
          ? `active:text-black dark:active:text-white`
          : `active:text-white dark:active:text-black`),
      inverted ? `text-white dark:text-black` : `text-black dark:text-white`,
      placeholder && `placeholder-gray-400`,
    );
  },
});

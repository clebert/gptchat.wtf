import * as React from 'react';

export interface Styles {
  readonly text: string;
  readonly textActive: string;
  readonly textInverted: string;
  readonly textInvertedActive: string;
  readonly textPlaceholder: string;
  readonly background: string;
  readonly backgroundActive: string;
  readonly backgroundInverted: string;
  readonly backgroundInvertedActive: string;
  readonly border: string;
  readonly borderTransparent: string;
  readonly focus: string;
  readonly focusWithin: string;
}

export const StylesContext = React.createContext<Styles>({
  text: `text-black dark:text-white`,
  textActive: `active:text-white dark:active:text-black`,
  textInverted: `text-white dark:text-black`,
  textInvertedActive: `active:text-black dark:active:text-white`,
  textPlaceholder: `placeholder-gray-400`,
  background: `bg-white dark:bg-neutral-900`,
  backgroundActive: `active:bg-neutral-900 dark:active:bg-white`,
  backgroundInverted: `bg-neutral-900 dark:bg-white`,
  backgroundInvertedActive: `active:bg-white dark:active:bg-neutral-900`,
  border: `border border-neutral-300 dark:border-neutral-700`,
  borderTransparent: `border border-transparent`,
  focus: `focus:outline focus:outline-1 focus:outline-offset-[-1px] focus:outline-blue-400`,
  focusWithin: `focus-within:outline focus-within:outline-1 focus-within:outline-offset-[-1px] focus-within:outline-blue-400`,
});

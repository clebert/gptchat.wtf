import {colorSchemeMachine} from '../machines/color-scheme-machine.js';
import * as React from 'react';

const mediaQuery = window.matchMedia(`(prefers-color-scheme: dark)`);

export function useDarkMode(): boolean {
  const [prefersDark, setPrefersDark] = React.useState(mediaQuery.matches);

  React.useEffect(() => {
    const abortController = new AbortController();

    mediaQuery.addEventListener(
      `change`,
      () => {
        setPrefersDark(mediaQuery.matches);
      },
      {signal: abortController.signal},
    );

    return () => {
      abortController.abort();
    };
  }, []);

  const {state: colorScheme} = React.useSyncExternalStore(colorSchemeMachine.subscribe, () =>
    colorSchemeMachine.get(),
  );

  return colorScheme === `isDark` || (colorScheme === `isAuto` && prefersDark);
}

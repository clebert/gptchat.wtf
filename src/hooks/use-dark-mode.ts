import {AppContext} from '../contexts/app-context.js';
import * as React from 'react';

const mediaQuery = window.matchMedia(`(prefers-color-scheme: dark)`);

export function useDarkMode(): boolean {
  const {colorSchemeStore} = React.useContext(AppContext);
  const colorScheme = colorSchemeStore.use();
  const [prefersDark, setPrefersDark] = React.useState(mediaQuery.matches);

  React.useEffect(() => {
    const listener = () => setPrefersDark(mediaQuery.matches);

    mediaQuery.addEventListener(`change`, listener);

    return () => mediaQuery.removeEventListener(`change`, listener);
  }, []);

  return colorScheme === `dark` || (colorScheme === `auto` && prefersDark);
}

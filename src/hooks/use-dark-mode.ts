import {AppContext} from '../contexts/app-context.js';
import {useSyncExternalStore} from 'preact/compat';
import {useContext, useEffect, useState} from 'preact/hooks';

const mediaQuery = window.matchMedia(`(prefers-color-scheme: dark)`);

export function useDarkMode(): boolean {
  const {colorSchemeStore} = useContext(AppContext);

  const colorScheme = useSyncExternalStore(
    colorSchemeStore.subscribe,
    colorSchemeStore.getSnapshot,
  );

  const [prefersDark, setPrefersDark] = useState(mediaQuery.matches);

  useEffect(() => {
    const listener = () => setPrefersDark(mediaQuery.matches);

    mediaQuery.addEventListener(`change`, listener);

    return () => mediaQuery.removeEventListener(`change`, listener);
  }, []);

  return colorScheme === `dark` || (colorScheme === `auto` && prefersDark);
}

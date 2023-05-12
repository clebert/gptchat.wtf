import {AppContext} from '../contexts/app-context.js';
import {useCallback, useContext} from 'preact/hooks';

export function useToggleColorSchemeCallback(): () => void {
  const {colorSchemeStore} = useContext(AppContext);

  return useCallback(() => {
    switch (colorSchemeStore.get()) {
      case `auto`: {
        colorSchemeStore.set(`dark`);
        break;
      }
      case `dark`: {
        colorSchemeStore.set(`light`);
        break;
      }
      case `light`: {
        colorSchemeStore.set(`auto`);
      }
    }
  }, []);
}

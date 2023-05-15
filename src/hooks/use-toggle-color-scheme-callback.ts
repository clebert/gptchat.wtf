import {AppContext} from '../contexts/app-context.js';
import * as React from 'react';

export function useToggleColorSchemeCallback(): () => void {
  const {colorSchemeStore} = React.useContext(AppContext);

  return React.useCallback(() => {
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

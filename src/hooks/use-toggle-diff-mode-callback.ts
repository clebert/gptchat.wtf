import {AppContext} from '../contexts/app-context.js';
import * as React from 'react';

export function useToggleDiffModeCallback(): () => void {
  const {diffModeStore} = React.useContext(AppContext);

  return React.useCallback(() => {
    if (diffModeStore.get()) {
      diffModeStore.set(false);
    } else {
      diffModeStore.set(true);
    }
  }, []);
}

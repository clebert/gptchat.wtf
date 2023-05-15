import {AppContext} from '../contexts/app-context.js';
import * as React from 'react';

export function useToggleModelCallback(): () => void {
  const {modelStore} = React.useContext(AppContext);

  return React.useCallback(() => {
    if (modelStore.get() === `gpt-4`) {
      modelStore.set(`gpt-3.5-turbo`);
    } else {
      modelStore.set(`gpt-4`);
    }
  }, []);
}

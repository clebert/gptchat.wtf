import {AppContext} from '../contexts/app-context.js';
import * as React from 'react';

export function useCancelCompletionCallback(): () => void {
  const {completionStore} = React.useContext(AppContext);

  return React.useCallback(() => {
    completionStore.set({status: `idle`});
  }, []);
}

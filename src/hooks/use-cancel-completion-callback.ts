import {AppContext} from '../contexts/app-context.js';
import {useCallback, useContext} from 'preact/hooks';

export function useCancelCompletionCallback(): () => void {
  const {completionStore} = useContext(AppContext);

  return useCallback(() => {
    completionStore.set({status: `idle`});
  }, []);
}

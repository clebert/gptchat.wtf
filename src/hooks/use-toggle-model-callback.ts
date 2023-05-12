import {AppContext} from '../contexts/app-context.js';
import {useCallback, useContext} from 'preact/hooks';

export function useToggleModelCallback(): () => void {
  const {modelStore} = useContext(AppContext);

  return useCallback(() => {
    if (modelStore.get() === `gpt-4`) {
      modelStore.set(`gpt-3.5-turbo`);
    } else {
      modelStore.set(`gpt-4`);
    }
  }, []);
}

import {AppContext} from '../contexts/app-context.js';
import {useCallback, useContext} from 'preact/hooks';

export function useToggleAssistantModeCallback(): () => void {
  const {assistantModeStore} = useContext(AppContext);

  return useCallback(() => {
    if (assistantModeStore.get() === `general`) {
      assistantModeStore.set(`programming`);
    } else {
      assistantModeStore.set(`general`);
    }
  }, []);
}

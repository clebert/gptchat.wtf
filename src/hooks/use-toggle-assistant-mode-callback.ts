import {AppContext} from '../contexts/app-context.js';
import * as React from 'react';

export function useToggleAssistantModeCallback(): () => void {
  const {assistantModeStore} = React.useContext(AppContext);

  return React.useCallback(() => {
    if (assistantModeStore.get() === `general`) {
      assistantModeStore.set(`programming`);
    } else {
      assistantModeStore.set(`general`);
    }
  }, []);
}

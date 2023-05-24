import {Button} from './button.js';
import {Icon} from './icon.js';
import {AppContext} from '../contexts/app-context.js';
import {useToggleDiffModeCallback} from '../hooks/use-toggle-diff-mode-callback.js';
import * as React from 'react';

export function DiffModeButton(): JSX.Element {
  const toggleDiffMode = useToggleDiffModeCallback();
  const {diffModeStore} = React.useContext(AppContext);
  const mode = diffModeStore.use();

  return (
    <Button
      className="border-dashed"
      title={mode ? `Diffing On` : `Diffing Off`}
      onClick={toggleDiffMode}
    >
      <Icon type={mode ? `eye` : `eyeSlash`} standalone />
    </Button>
  );
}

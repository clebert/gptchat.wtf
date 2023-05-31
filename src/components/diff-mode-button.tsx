import {Button} from './button.js';
import {Icon} from './icon.js';
import {diffModeStore} from '../stores/diff-mode-store.js';
import {useStore} from '../wtfkit/use-store.js';
import * as React from 'react';

const titles = {off: `Diffing Off`, on: `Diffing On`};
const iconTypes = {off: `eyeSlash`, on: `eye`} as const;

export function DiffModeButton(): JSX.Element {
  const diffMode = useStore(diffModeStore);

  const toggle = React.useCallback(() => {
    diffModeStore.get().actions.toggle();
  }, []);

  return (
    <Button
      className="border-dashed"
      title={titles[diffMode.state]}
      onClick={toggle}
    >
      <Icon type={iconTypes[diffMode.state]} standalone />
    </Button>
  );
}

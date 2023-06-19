import {Button} from './button.js';
import {Icon} from './icon.js';
import {colorSchemeMachine} from '../machines/color-scheme-machine.js';
import * as React from 'react';

const titles = {isAuto: `System Theme`, isLight: `Day Theme`, isDark: `Night Theme`};

const iconTypes = {
  isAuto: `computerDesktop`,
  isLight: `sun`,
  isDark: `moon`,
} as const;

export function ColorSchemeButton(): JSX.Element {
  const {state: colorScheme} = React.useSyncExternalStore(colorSchemeMachine.subscribe, () =>
    colorSchemeMachine.get(),
  );

  const toggle = React.useCallback(() => {
    colorSchemeMachine.get().actions.toggle();
  }, []);

  return (
    <Button className="border-dashed" title={titles[colorScheme]} onClick={toggle}>
      <Icon type={iconTypes[colorScheme]} standalone />
    </Button>
  );
}

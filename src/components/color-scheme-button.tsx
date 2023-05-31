import {Button} from './button.js';
import {Icon} from './icon.js';
import {colorSchemeStore} from '../stores/color-scheme-store.js';
import {useStore} from '../wtfkit/use-store.js';
import * as React from 'react';

const titles = {auto: `System Theme`, light: `Day Theme`, dark: `Night Theme`};

const iconTypes = {
  auto: `computerDesktop`,
  light: `sun`,
  dark: `moon`,
} as const;

export function ColorSchemeButton(): JSX.Element {
  const colorScheme = useStore(colorSchemeStore);

  const toggle = React.useCallback(() => {
    colorSchemeStore.get().actions.toggle();
  }, []);

  return (
    <Button
      className="border-dashed"
      title={titles[colorScheme.state]}
      onClick={toggle}
    >
      <Icon type={iconTypes[colorScheme.state]} standalone />
    </Button>
  );
}

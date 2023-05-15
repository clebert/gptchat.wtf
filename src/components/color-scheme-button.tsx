import {Button} from './button.js';
import {Icon} from './icon.js';
import {AppContext} from '../contexts/app-context.js';
import {useToggleColorSchemeCallback} from '../hooks/use-toggle-color-scheme-callback.js';
import * as React from 'react';

const titles = {auto: `System Theme`, light: `Day Theme`, dark: `Night Theme`};

const iconTypes = {
  auto: `computerDesktop`,
  light: `sun`,
  dark: `moon`,
} as const;

export function ColorSchemeButton(): JSX.Element {
  const toggleColorScheme = useToggleColorSchemeCallback();
  const {colorSchemeStore} = React.useContext(AppContext);
  const colorScheme = colorSchemeStore.use();

  return (
    <Button
      className="border-dashed"
      title={titles[colorScheme]}
      onClick={toggleColorScheme}
    >
      <Icon type={iconTypes[colorScheme]} standalone />
    </Button>
  );
}

import type {JSX} from 'preact';

import {Button} from './button.js';
import {Icon} from './icon.js';
import {AppContext} from '../contexts/app-context.js';
import {useToggleColorSchemeCallback} from '../hooks/use-toggle-color-scheme-callback.js';
import {useContext} from 'preact/hooks';

const titles = {auto: `System theme`, light: `Day theme`, dark: `Night theme`};

const iconTypes = {
  auto: `computerDesktop`,
  light: `sun`,
  dark: `moon`,
} as const;

export function ColorSchemeButton(): JSX.Element {
  const toggleColorScheme = useToggleColorSchemeCallback();
  const {colorSchemeStore} = useContext(AppContext);
  const colorScheme = colorSchemeStore.use();

  return (
    <Button
      class="border-dashed"
      title={titles[colorScheme]}
      onClick={toggleColorScheme}
    >
      <Icon type={iconTypes[colorScheme]} standalone />
    </Button>
  );
}

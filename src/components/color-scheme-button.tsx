import type {JSX} from 'preact';

import {Button} from './button.js';
import {Icon} from './icon.js';
import {AppContext} from '../contexts/app-context.js';
import {useCallback, useContext} from 'preact/hooks';

const titles = {auto: `System theme`, light: `Day theme`, dark: `Night theme`};

const iconTypes = {
  auto: `computerDesktop`,
  light: `sun`,
  dark: `moon`,
} as const;

export function ColorSchemeButton(): JSX.Element {
  const {colorSchemeStore} = useContext(AppContext);
  const colorScheme = colorSchemeStore.useExternalState();

  const toggleColorScheme = useCallback(() => {
    if (colorScheme === `auto`) {
      colorSchemeStore.set(`dark`);
    } else if (colorScheme === `dark`) {
      colorSchemeStore.set(`light`);
    } else {
      colorSchemeStore.set(`auto`);
    }
  }, [colorScheme]);

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

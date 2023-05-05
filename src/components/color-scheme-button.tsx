import type {JSX} from 'preact';

import {AppContext} from '../contexts/app-context.js';
import {Button} from '../core-components/button.js';
import {Icon} from '../core-components/icon.js';
import {useSyncExternalStore} from 'preact/compat';
import {useCallback, useContext} from 'preact/hooks';

const titles = {auto: `System theme`, light: `Day theme`, dark: `Night theme`};

const iconTypes = {
  auto: `computerDesktop`,
  light: `sun`,
  dark: `moon`,
} as const;

export function ColorSchemeButton(): JSX.Element {
  const {colorSchemeStore} = useContext(AppContext);

  const colorScheme = useSyncExternalStore(
    colorSchemeStore.subscribe,
    colorSchemeStore.getSnapshot,
  );

  const toggleColorScheme = useCallback(() => {
    if (colorScheme === `auto`) {
      colorSchemeStore.publish(`dark`);
    } else if (colorScheme === `dark`) {
      colorSchemeStore.publish(`light`);
    } else {
      colorSchemeStore.publish(`auto`);
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

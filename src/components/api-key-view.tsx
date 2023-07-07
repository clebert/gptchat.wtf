import {apiKeyMachine} from '../machines/api-key-machine.js';
import * as React from 'react';
import {TextField} from 'wtfkit';

export function ApiKeyView(): JSX.Element {
  const textFieldRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    textFieldRef.current?.focus();
  }, []);

  const {value: apiKey} = React.useSyncExternalStore(apiKeyMachine.subscribe, () =>
    apiKeyMachine.get(),
  );

  const setApiKey = React.useCallback((value: string) => {
    apiKeyMachine.get().actions.initialize(value);
  }, []);

  return (
    <TextField
      ref={textFieldRef}
      type="password"
      value={apiKey}
      placeholder="API key"
      onInput={setApiKey}
    />
  );
}

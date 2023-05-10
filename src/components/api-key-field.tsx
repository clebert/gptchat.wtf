import type {JSX} from 'preact';

import {TextField} from './text-field.js';
import {AppContext} from '../contexts/app-context.js';
import {useCallback, useContext} from 'preact/hooks';

export function ApiKeyField(): JSX.Element {
  const {apiKeyStore} = useContext(AppContext);
  const apiKey = apiKeyStore.useExternalState();

  const setApiKey = useCallback((value: string) => {
    apiKeyStore.set(value);
  }, []);

  return (
    <TextField
      type="password"
      value={apiKey}
      placeholder="API key"
      onInput={setApiKey}
    />
  );
}

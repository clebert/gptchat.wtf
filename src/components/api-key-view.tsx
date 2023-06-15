import {Button} from './button.js';
import {Icon} from './icon.js';
import {TextField} from './text-field.js';
import {apiKeyStore} from '../stores/api-key-store.js';
import * as React from 'react';

export function ApiKeyView(): JSX.Element {
  const setApiKey = React.useCallback((value: string) => {
    apiKeyStore.get().actions.set(value);
  }, []);

  const [showApiKey, setShowApiKey] = React.useState(
    () => apiKeyStore.get().value.length === 0,
  );

  const handleShowApiKeyClick = React.useCallback(() => {
    setShowApiKey(true);
  }, []);

  const apiKeyFieldRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const apiKeyField = apiKeyFieldRef.current;

    if (!showApiKey || !apiKeyField) {
      return;
    }

    apiKeyField.focus();

    const handleBlur = () => {
      setShowApiKey(apiKeyStore.get().value.length === 0);
    };

    apiKeyField.addEventListener(`blur`, handleBlur);

    return () => {
      apiKeyField?.removeEventListener(`blur`, handleBlur);
    };
  }, [showApiKey]);

  const apiKeySnapshot = React.useSyncExternalStore(apiKeyStore.subscribe, () =>
    apiKeyStore.get(),
  );

  if (!showApiKey && !apiKeySnapshot.value) {
    setShowApiKey(true);
  }

  return showApiKey ? (
    <TextField
      ref={apiKeyFieldRef}
      value={apiKeySnapshot.value}
      placeholder="API Key"
      onInput={setApiKey}
    />
  ) : (
    <Button title="Show API Key" onClick={handleShowApiKeyClick}>
      <Icon type="key" standalone />
    </Button>
  );
}

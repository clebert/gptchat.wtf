import {Button} from './button.js';
import {Icon} from './icon.js';
import {TextField} from './text-field.js';
import {AppContext} from '../contexts/app-context.js';
import * as React from 'react';

export function ApiKeyView(): JSX.Element {
  const {apiKeyStore} = React.useContext(AppContext);

  const setApiKey = React.useCallback((value: string) => {
    apiKeyStore.set(value);
  }, []);

  const [showApiKey, setShowApiKey] = React.useState(
    () => apiKeyStore.get().length === 0,
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
      setShowApiKey(apiKeyStore.get().length === 0);
    };

    apiKeyField.addEventListener(`blur`, handleBlur);

    return () => {
      apiKeyField?.removeEventListener(`blur`, handleBlur);
    };
  }, [showApiKey]);

  const apiKey = apiKeyStore.use();

  if (!showApiKey && !apiKey) {
    setShowApiKey(true);
  }

  return showApiKey ? (
    <TextField
      ref={apiKeyFieldRef}
      value={apiKey}
      placeholder="API Key"
      onInput={setApiKey}
    />
  ) : (
    <Button title="Show API Key" onClick={handleShowApiKeyClick}>
      <Icon type="key" standalone />
    </Button>
  );
}

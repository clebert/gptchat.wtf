import type {JSX} from 'preact';

import {Button} from './button.js';
import {Icon} from './icon.js';
import {TextField} from './text-field.js';
import {AppContext} from '../contexts/app-context.js';
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'preact/hooks';

export function ApiKeyView(): JSX.Element {
  const {apiKeyStore} = useContext(AppContext);

  const setApiKey = useCallback((value: string) => {
    apiKeyStore.set(value);
  }, []);

  const [showApiKey, setShowApiKey] = useState(
    () => apiKeyStore.get().length === 0,
  );

  const handleShowApiKeyClick = useCallback(() => {
    setShowApiKey(true);
  }, []);

  const apiKeyFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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

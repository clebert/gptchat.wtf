import {Button} from './button.js';
import {Icon} from './icon.js';
import {TextField} from './text-field.js';
import {apiKeyMachine} from '../machines/api-key-machine.js';
import * as React from 'react';

export function ApiKeyView(): JSX.Element {
  const {value: apiKey} = React.useSyncExternalStore(apiKeyMachine.subscribe, () =>
    apiKeyMachine.get(),
  );

  const [isTextFieldVisible, setIsTextFieldVisible] = React.useState(() => apiKey.length === 0);

  if (apiKey.length === 0 && !isTextFieldVisible) {
    setIsTextFieldVisible(true);
  }

  const showTextField = React.useCallback(() => {
    setIsTextFieldVisible(true);
  }, []);

  const textFieldRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const textField = textFieldRef.current;

    if (!isTextFieldVisible || !textField) {
      return;
    }

    textField.focus();

    const blur = () => {
      setIsTextFieldVisible(apiKeyMachine.get().value.length === 0);
    };

    textField.addEventListener(`blur`, blur);

    return () => {
      textField.removeEventListener(`blur`, blur);
    };
  }, [isTextFieldVisible]);

  const setApiKey = React.useCallback((value: string) => {
    apiKeyMachine.get().actions.initialize(value);
  }, []);

  return isTextFieldVisible ? (
    <TextField ref={textFieldRef} value={apiKey} placeholder="API Key" onInput={setApiKey} />
  ) : (
    <Button title="Show API Key" onClick={showTextField}>
      <Icon type="key" standalone />
    </Button>
  );
}

import type {JSX} from 'preact';

import {Button} from './button.js';
import {Editor} from './editor.js';
import {Icon} from './icon.js';
import {RoleIcon} from './role-icon.js';
import {AppContext} from '../contexts/app-context.js';
import debounce from 'lodash.debounce';
import * as monaco from 'monaco-editor';
import {useCallback, useContext, useEffect, useMemo} from 'preact/hooks';

export function SystemMessageView(): JSX.Element {
  const {systemMessageContentStore} = useContext(AppContext);

  const model = useMemo(
    () =>
      monaco.editor.createModel(systemMessageContentStore.get(), `markdown`),
    [],
  );

  const restoreDefault = useCallback(() => {
    systemMessageContentStore.set(undefined);
    model.setValue(systemMessageContentStore.get());
  }, []);

  useEffect(() => {
    model.onDidChangeContent(
      debounce(() => systemMessageContentStore.set(model.getValue()), 500),
    );

    return () => model.dispose();
  }, []);

  return (
    <div className="flex space-x-2">
      <div class="flex shrink-0 flex-col space-y-2">
        <Button title="Restore default" onClick={restoreDefault}>
          <Icon type="arrowUturnLeft" standalone />
        </Button>

        <RoleIcon role="system" />
      </div>

      <div class="w-full overflow-hidden">
        <Editor class="h-full" model={model} />
      </div>
    </div>
  );
}

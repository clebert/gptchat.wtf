import type {JSX} from 'preact';

import {Editor} from './editor.js';
import {RoleIcon} from './role-icon.js';
import {AppContext} from '../contexts/app-context.js';
import debounce from 'lodash.debounce';
import * as monaco from 'monaco-editor';
import {useContext, useEffect, useMemo} from 'preact/hooks';

export function SystemMessageView(): JSX.Element {
  const {systemMessageContentStore} = useContext(AppContext);

  const model = useMemo(
    () =>
      monaco.editor.createModel(systemMessageContentStore.get(), `markdown`),
    [],
  );

  useEffect(() => {
    model.onDidChangeContent(
      debounce(() => systemMessageContentStore.set(model.getValue()), 500),
    );

    return () => model.dispose();
  }, []);

  return (
    <div className="flex space-x-2">
      <div class="flex shrink-0 flex-col space-y-2">
        <RoleIcon role="system" />
      </div>

      <div class="w-full overflow-hidden">
        <Editor model={model} />
      </div>
    </div>
  );
}

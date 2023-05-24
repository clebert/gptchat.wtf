import type * as monaco from 'monaco-editor';

import './editor.css';
import {MonacoDiffEditor} from './monaco-diff-editor.js';
import {StylesContext} from '../contexts/styles-context.js';
import {useDarkMode} from '../hooks/use-dark-mode.js';
import {join} from '../utils/join.js';
import {resizeDiffEditor} from '../utils/resize-diff-editor.js';
import {scrollToCursor} from '../utils/scroll-to-cursor.js';
import * as React from 'react';

export interface DiffEditorProps {
  className?: string;
  originalModel: monaco.editor.ITextModel;
  modifiedModel: monaco.editor.ITextModel;
  autoFocus?: boolean;
  autoScroll?: boolean;
  readOnly?: boolean;
}

export function DiffEditor({
  className,
  originalModel,
  modifiedModel,
  autoFocus,
  autoScroll,
  readOnly,
}: DiffEditorProps): JSX.Element {
  const diffEditorRef = React.useRef<monaco.editor.IStandaloneDiffEditor>(null);

  React.useEffect(() => {
    const diffEditor = diffEditorRef.current!;

    diffEditor.setModel({original: originalModel, modified: modifiedModel});

    if (autoFocus) {
      diffEditor.focus();
    }

    resizeDiffEditor(diffEditor);

    diffEditor.getOriginalEditor().onDidChangeCursorPosition(() => {
      if (autoScroll && diffEditor.getOriginalEditor().hasTextFocus()) {
        scrollToCursor(diffEditor.getOriginalEditor());
      }
    });

    diffEditor.getOriginalEditor().onDidChangeModelContent(() => {
      resizeDiffEditor(diffEditor);
    });

    diffEditor.getModifiedEditor().onDidChangeCursorPosition(() => {
      if (autoScroll && diffEditor.getModifiedEditor().hasTextFocus()) {
        scrollToCursor(diffEditor.getModifiedEditor());
      }
    });

    diffEditor.getModifiedEditor().onDidChangeModelContent(() => {
      resizeDiffEditor(diffEditor);
    });

    const abortController = new AbortController();

    window.addEventListener(
      `resize`,
      () => {
        resizeDiffEditor(diffEditor);
      },
      {signal: abortController.signal},
    );

    return () => {
      abortController.abort();
    };
  }, []);

  const darkMode = useDarkMode();

  React.useEffect(() => {
    // @ts-ignore
    diffEditorRef.current!._themeService.setTheme(darkMode ? `vs-dark` : `vs`);
  }, [darkMode]);

  const styles = React.useContext(StylesContext);

  return (
    <MonacoDiffEditor
      ref={diffEditorRef}
      className={join(className, styles.border(), styles.focus({within: true}))}
      options={{
        contextmenu: false,
        fontSize: 16,
        lineNumbers: `off`,
        minimap: {enabled: false},
        originalEditable: !readOnly,
        readOnly,
        scrollBeyondLastLine: false,
        wordWrap: `on`,
        scrollbar: {
          vertical: `hidden`,
          horizontal: `hidden`,
          handleMouseWheel: false,
        },
      }}
    />
  );
}

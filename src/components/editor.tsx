import type * as monaco from 'monaco-editor';

import './editor.css';
import {MonacoEditor} from './monaco-editor.js';
import {StylesContext} from '../contexts/styles-context.js';
import {useDarkMode} from '../hooks/use-dark-mode.js';
import {resizeEditor} from '../utils/resize-editor.js';
import {scrollToCursor} from '../utils/scroll-to-cursor.js';
import {joinClassNames} from '../wtfkit/join-class-names.js';
import * as React from 'react';

export interface EditorProps {
  className?: string;
  model: monaco.editor.ITextModel;
  autoFocus?: boolean;
  autoScroll?: boolean;
  readOnly?: boolean;
}

export function Editor({
  className,
  model,
  autoFocus,
  autoScroll,
  readOnly,
}: EditorProps): JSX.Element {
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>(null);

  React.useEffect(() => {
    const editor = editorRef.current!;

    if (autoFocus) {
      editor.focus();
    }

    resizeEditor(editor);

    editor.onDidChangeCursorPosition(() => {
      if (autoScroll && editor.hasTextFocus()) {
        scrollToCursor(editor);
      }
    });

    editor.onDidChangeModelContent(() => {
      resizeEditor(editor);
    });

    const abortController = new AbortController();

    window.addEventListener(
      `resize`,
      () => {
        resizeEditor(editor);
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
    editorRef.current!._themeService.setTheme(darkMode ? `vs-dark` : `vs`);
  }, [darkMode]);

  const styles = React.useContext(StylesContext);

  return (
    <MonacoEditor
      ref={editorRef}
      className={joinClassNames(
        className,
        styles.border(),
        styles.focus({within: true}),
      )}
      options={{
        contextmenu: false,
        fontSize: 16,
        lineNumbers: `off`,
        minimap: {enabled: false},
        model,
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

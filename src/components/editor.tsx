import type * as monaco from 'monaco-editor';

import './editor.css';
import {MonacoEditor} from './monaco-editor.js';
import {resizeEditor} from '../utils/resize-editor.js';
import {scrollToCursor} from '../utils/scroll-to-cursor.js';
import * as React from 'react';
import {Styles, joinClassNames, useDarkMode} from 'wtfkit';

export interface EditorProps {
  className?: string;
  model: monaco.editor.ITextModel;
  autoFocus?: boolean;
  autoScroll?: boolean;
  readOnly?: boolean;
}

export const Editor = React.forwardRef(
  (
    {className, model, autoFocus, autoScroll, readOnly}: EditorProps,
    ref: React.ForwardedRef<monaco.editor.IStandaloneCodeEditor>,
  ): JSX.Element => {
    const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>(null);

    React.useEffect(() => {
      if (typeof ref === `function`) {
        ref(editorRef.current);
      } else if (ref) {
        ref.current = editorRef.current;
      }

      return () => {
        if (typeof ref === `function`) {
          ref(null);
        } else if (ref) {
          ref.current = null;
        }
      };
    }, []);

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

    const styles = React.useContext(Styles.Context);

    return (
      <MonacoEditor
        ref={editorRef}
        className={joinClassNames(className, styles.border(), styles.focus({within: true}))}
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
  },
);

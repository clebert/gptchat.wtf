import './editor.css';
import {StylesContext} from '../contexts/styles-context.js';
import {useDarkMode} from '../hooks/use-dark-mode.js';
import {join} from '../utils/join.js';
import {resizeEditor} from '../utils/resize-editor.js';
import {scrollToCursor} from '../utils/scroll-to-cursor.js';
import * as monaco from 'monaco-editor';
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
  const styles = React.useContext(StylesContext);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>();

  React.useEffect(() => {
    const editor = (editorRef.current = monaco.editor.create(
      containerRef.current!,
      {
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
      },
    ));

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
      editor.dispose();
    };
  }, []);

  const darkMode = useDarkMode();

  React.useEffect(() => {
    // @ts-ignore
    editorRef.current!._themeService.setTheme(darkMode ? `vs-dark` : `vs`);
  }, [darkMode]);

  return (
    <div
      ref={containerRef}
      className={join(className, styles.border, styles.focusWithin)}
    ></div>
  );
}

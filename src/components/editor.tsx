import type {JSX} from 'preact';

import './editor.css';
import {StylesContext} from '../contexts/styles-context.js';
import {useDarkMode} from '../hooks/use-dark-mode.js';
import {join} from '../utils/join.js';
import {resizeEditor} from '../utils/resize-editor.js';
import {scrollToCursor} from '../utils/scroll-to-cursor.js';
import * as monaco from 'monaco-editor';
import {useContext, useEffect, useRef} from 'preact/hooks';

export interface EditorProps {
  class?: string;
  model: monaco.editor.ITextModel;
  autoScroll?: boolean;
  readOnly?: boolean;
}

export function Editor({
  class: className,
  model,
  autoScroll,
  readOnly,
}: EditorProps): JSX.Element {
  const styles = useContext(StylesContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  useEffect(() => {
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

  useEffect(() => {
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

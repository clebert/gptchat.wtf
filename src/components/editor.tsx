import type {JSX} from 'preact';

import './editor.css';
import {StylesContext} from '../contexts/styles-context.js';
import {useDarkMode} from '../hooks/use-dark-mode.js';
import {join} from '../utils/join.js';
import * as monaco from 'monaco-editor';
import {useCallback, useContext, useEffect, useRef} from 'preact/hooks';

export interface EditorProps {
  class?: string;
  model: monaco.editor.ITextModel | null;
  readOnly?: boolean;
}

export function Editor({
  class: className,
  model,
  readOnly,
}: EditorProps): JSX.Element {
  const styles = useContext(StylesContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  const resize = useCallback(() => {
    const lineHeight = editorRef.current!.getOption(
      monaco.editor.EditorOption.lineHeight,
    );

    const contentHeigth = Math.max(
      lineHeight * 5,
      editorRef.current!.getContentHeight(),
    );

    containerRef.current!.style.height = `${contentHeigth + 2}px`;
    editorRef.current!.layout();
  }, []);

  useEffect(() => {
    editorRef.current = monaco.editor.create(containerRef.current!, {
      contextmenu: false,
      fontSize: 16,
      lineNumbers: `off`,
      minimap: {enabled: false},
      readOnly,
      scrollBeyondLastLine: false,
      wordWrap: `on`,
      scrollbar: {
        vertical: `hidden`,
        horizontal: `hidden`,
        handleMouseWheel: false,
      },
    });

    window.addEventListener(`resize`, resize);

    return () => {
      window.removeEventListener(`resize`, resize);
      editorRef.current!.dispose();
    };
  }, []);

  useEffect(() => {
    editorRef.current!.setModel(model);
    resize();

    const disposable = model?.onDidChangeContent(resize);

    return () => {
      disposable?.dispose();
    };
  }, [model]);

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

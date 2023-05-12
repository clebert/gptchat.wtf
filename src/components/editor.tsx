import type {JSX} from 'preact';

import './editor.css';
import {StylesContext} from '../contexts/styles-context.js';
import {useDarkMode} from '../hooks/use-dark-mode.js';
import {join} from '../utils/join.js';
import * as monaco from 'monaco-editor';
import {useContext, useEffect, useRef} from 'preact/hooks';

export interface EditorProps {
  class?: string;
  model: monaco.editor.ITextModel | null;
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
    editorRef.current = monaco.editor.create(containerRef.current!, {
      contextmenu: false,
      lineNumbers: `off`,
      minimap: {enabled: false},
      readOnly,
      scrollBeyondLastLine: false,
      wordWrap: `on`,
    });

    const onResize = () => editorRef.current!.layout();

    window.addEventListener(`resize`, onResize);

    return () => {
      window.removeEventListener(`resize`, onResize);
      editorRef.current!.dispose();
    };
  }, []);

  useEffect(() => {
    editorRef.current!.setModel(model);

    const disposable = autoScroll
      ? model?.onDidChangeContent(() => {
          editorRef.current!.revealLine(
            model.getLineCount(),
            monaco.editor.ScrollType.Immediate,
          );
        })
      : undefined;

    return () => {
      disposable?.dispose();
    };
  }, [model, autoScroll]);

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

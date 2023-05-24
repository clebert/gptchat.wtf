import * as monaco from 'monaco-editor';
import * as React from 'react';

export interface MonacoEditorProps {
  className?: string;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
}

export const MonacoEditor = React.forwardRef(
  (
    {className, options}: MonacoEditorProps,
    ref: React.ForwardedRef<monaco.editor.IStandaloneCodeEditor>,
  ): JSX.Element => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const editor = monaco.editor.create(containerRef.current!, options);

      if (typeof ref === `function`) {
        ref(editor);
      } else if (ref) {
        ref.current = editor;
      }

      return () => {
        if (typeof ref === `function`) {
          ref(null);
        } else if (ref) {
          ref.current = null;
        }

        editor.dispose();
      };
    }, []);

    return <div ref={containerRef} className={className} />;
  },
);

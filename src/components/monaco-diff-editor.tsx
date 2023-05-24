import * as monaco from 'monaco-editor';
import * as React from 'react';

export interface MonacoDiffEditorProps {
  className?: string;
  options?: monaco.editor.IStandaloneDiffEditorConstructionOptions;
}

export const MonacoDiffEditor = React.forwardRef(
  (
    {className, options}: MonacoDiffEditorProps,
    ref: React.ForwardedRef<monaco.editor.IStandaloneDiffEditor>,
  ): JSX.Element => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const diffEditor = monaco.editor.createDiffEditor(
        containerRef.current!,
        options,
      );

      if (typeof ref === `function`) {
        ref(diffEditor);
      } else if (ref) {
        ref.current = diffEditor;
      }

      return () => {
        if (typeof ref === `function`) {
          ref(null);
        } else if (ref) {
          ref.current = null;
        }

        diffEditor.dispose();
      };
    }, []);

    return <div ref={containerRef} className={className} />;
  },
);

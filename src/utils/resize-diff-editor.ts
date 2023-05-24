import * as monaco from 'monaco-editor';

export function resizeDiffEditor(
  diffEditor: monaco.editor.IStandaloneDiffEditor,
): void {
  const originalEditor = diffEditor.getOriginalEditor();
  const modifiedEditor = diffEditor.getModifiedEditor();

  const lineHeight = Math.max(
    originalEditor.getOption(monaco.editor.EditorOption.lineHeight),
    modifiedEditor.getOption(monaco.editor.EditorOption.lineHeight),
  );

  const contentHeight = Math.max(
    lineHeight * 5,
    originalEditor.getContentHeight(),
    modifiedEditor.getContentHeight(),
  );

  diffEditor.getContainerDomNode().style.height = `${contentHeight + 2}px`;
  diffEditor.layout();
}

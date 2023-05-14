import * as monaco from 'monaco-editor';

export function resizeEditor(
  editor: monaco.editor.IStandaloneCodeEditor,
): void {
  const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
  const contentHeight = Math.max(lineHeight * 5, editor.getContentHeight());

  editor.getContainerDomNode().style.height = `${contentHeight + 2}px`;
  editor.layout();
}

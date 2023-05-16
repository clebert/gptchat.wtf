import {getViewportHeight} from './get-viewport-height.js';
import * as monaco from 'monaco-editor';

export function scrollToCursor(
  editor: monaco.editor.IStandaloneCodeEditor,
): void {
  const position = editor.getPosition();

  const scrolledVisiblePosition =
    position && editor.getScrolledVisiblePosition(position);

  if (!scrolledVisiblePosition) {
    return;
  }

  const containerTop =
    window.scrollY + editor.getContainerDomNode().getBoundingClientRect().top;

  const lineTop = containerTop + scrolledVisiblePosition.top;

  if (lineTop < window.scrollY) {
    window.scrollTo({top: lineTop});
  } else {
    const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
    const lineBottom = lineTop + lineHeight;
    const viewportHeight = getViewportHeight();

    if (lineBottom > window.scrollY + viewportHeight) {
      window.scrollTo({top: lineBottom - viewportHeight});
    }
  }
}

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

  const {scrollTop} = document.documentElement;

  const containerTop =
    scrollTop + editor.getContainerDomNode().getBoundingClientRect().top;

  const lineTop = containerTop + scrolledVisiblePosition.top;

  if (lineTop < scrollTop) {
    window.scrollTo({top: lineTop});
  } else {
    const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
    const lineBottom = lineTop + lineHeight;
    const viewportHeight = getViewportHeight();

    if (lineBottom > scrollTop + viewportHeight) {
      window.scrollTo({top: lineBottom - viewportHeight});
    }
  }
}

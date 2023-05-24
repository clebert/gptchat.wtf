import {getViewportHeight} from './get-viewport-height.js';

export function isUserScrolledToBottom(): boolean {
  const {scrollHeight, scrollTop} = document.documentElement;
  const viewportHeight = getViewportHeight();
  const bottomOffset = viewportHeight * 0.1;

  return scrollHeight - scrollTop - viewportHeight < bottomOffset;
}

import {getViewportHeight} from './get-viewport-height.js';

export function isUserScrolledToBottom(): boolean {
  const scrollHeight = document.documentElement.scrollHeight;
  const viewportHeight = getViewportHeight();
  const scrollTop = document.documentElement.scrollTop;

  return scrollHeight - viewportHeight - scrollTop < 24;
}

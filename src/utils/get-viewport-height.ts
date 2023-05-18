export function getViewportHeight(): number {
  return window.visualViewport?.height ?? document.documentElement.clientHeight;
}

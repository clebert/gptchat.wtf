export function getViewportHeight(): number {
  return /iPhone/i.test(navigator.userAgent)
    ? window.innerHeight
    : document.documentElement.clientHeight;
}

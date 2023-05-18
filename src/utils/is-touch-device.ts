export function isTouchDevice(): boolean {
  return document.ontouchstart !== undefined || navigator.maxTouchPoints > 0;
}

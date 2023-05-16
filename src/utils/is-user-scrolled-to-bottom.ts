export function isUserScrolledToBottom(): boolean {
  const scrollHeight = document.documentElement.scrollHeight;

  const viewportHeight = /iPhone/i.test(navigator.userAgent)
    ? window.innerHeight
    : document.documentElement.clientHeight;

  const scrollTop = document.documentElement.scrollTop;

  return scrollHeight - viewportHeight - scrollTop < 24;
}

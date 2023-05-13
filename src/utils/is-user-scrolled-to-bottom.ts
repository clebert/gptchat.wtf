export function isUserScrolledToBottom(): boolean {
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;
  const scrollTop = document.documentElement.scrollTop;

  return scrollHeight - clientHeight - scrollTop < 24;
}

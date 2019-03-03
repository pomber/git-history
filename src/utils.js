export function nextIndex(list, currentIndex) {
  return Math.min(list.length - 1, Math.floor(currentIndex + 1));
}

export function prevIndex(list, currentIndex) {
  return Math.max(0, Math.ceil(currentIndex - 1));
}

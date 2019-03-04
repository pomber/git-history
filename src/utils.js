export function nextIndex(list, currentIndex) {
  return Math.min(list.length - 1, Math.floor(currentIndex + 1));
}

export function prevIndex(list, currentIndex) {
  return Math.max(0, Math.ceil(currentIndex - 1));
}

export function getScrollTop(area, contentHeight, containerHeight) {
  // todo remove 15
  const start = area.start * 15;
  const end = area.end * 15;
  const middle = (end + start) / 2;
  const halfContainer = containerHeight / 2;
  const bestTop =
    end - start > containerHeight ? start : middle - halfContainer;
  if (bestTop < 0) return 0;
  if (bestTop + containerHeight > contentHeight)
    return containerHeight - contentHeight;
  return bestTop;
}

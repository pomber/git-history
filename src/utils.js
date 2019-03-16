export function nextIndex(list, currentIndex) {
  return Math.min(list.length - 1, Math.floor(currentIndex + 1));
}

export function prevIndex(list, currentIndex) {
  return Math.max(0, Math.ceil(currentIndex - 1));
}

export function closestIndex(list, currentIndex) {
  return Math.min(Math.max(0, Math.round(currentIndex)), list.length - 1);
}

export function getScrollTop(area, contentHeight, containerHeight, heights) {
  const start = heights.slice(0, area.start).reduce((a, b) => a + b, 0);
  const end =
    start + heights.slice(area.start, area.end + 1).reduce((a, b) => a + b, 0);
  const middle = (end + start) / 2;
  const halfContainer = containerHeight / 2;
  const bestTop =
    end - start > containerHeight ? start : middle - halfContainer;
  if (bestTop < 0) return 0;
  if (bestTop + containerHeight > contentHeight)
    return containerHeight - contentHeight;
  return bestTop;
}

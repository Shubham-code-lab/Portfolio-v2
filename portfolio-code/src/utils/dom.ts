/** Returns true when the event target is an Element nested inside `container`. */
export const isElementInside = (
  target: EventTarget | null,
  container: HTMLElement | null,
): boolean => {
  if (!container) return false;
  if (!(target instanceof Element)) return false;
  return container.contains(target);
};

/** Returns true when the event target sits inside a [data-cursor-typography] ancestor. */
export const isOverTypography = (
  target: EventTarget | null,
  container: HTMLElement | null,
): boolean => {
  if (!isElementInside(target, container)) return false;
  if (!(target instanceof Element)) return false;
  return target.closest('[data-cursor-typography]') !== null;
};

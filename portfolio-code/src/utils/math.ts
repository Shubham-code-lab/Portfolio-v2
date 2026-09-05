export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

export const lerp = (start: number, end: number, factor: number): number =>
  start + (end - start) * factor;

export const mapProgress = (value: number, inMin: number, inMax: number): number =>
  clamp((value - inMin) / (inMax - inMin), 0, 1);

export const easeInOut = (progress: number): number =>
  progress < 0.5
    ? 2 * progress * progress
    : -1 + (4 - 2 * progress) * progress;

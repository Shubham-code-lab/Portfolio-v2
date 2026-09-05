/** Layout values shared across the carousel sub-components. */
export const CAROUSEL_LAYOUT = {
  /** Pixel gap between cards. */
  gap: 16,
  /** Image height (px). */
  imageHeight: 200,
  /** Vertical breathing room around each card so the hover scale(1.4) is not clipped. */
  expandPadding: 60,
  /** Max height (px) of the absolute-positioned detail panel that drops on hover. */
  detailHeight: 150,
} as const;

export const HOVER_SCALE = 1.4;

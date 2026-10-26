/** Layout values shared across the carousel sub-components. */
export const CAROUSEL_LAYOUT = {
  /** Pixel gap between cards. */
  gap: 20,
  /** Visible desktop card width (px). */
  cardWidth: 360,
  /** Visible card/image height (px). */
  imageHeight: 260,
  /** Vertical breathing room around each card so the hover expansion is not clipped. */
  expandPadding: 60,
  /** Max height (px) of the absolute-positioned detail panel that drops on hover. */
  detailHeight: 210,
} as const;

/** Hover grows the card by 20%; extra height comes from the detail panel below. */
export const HOVER_SCALE = 1.2;

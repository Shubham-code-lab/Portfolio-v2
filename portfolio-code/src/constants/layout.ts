// Layout constants used across the application
export const NAVBAR_HEIGHT = 70;
/** Sticky offset for hero copy + desert (below navbar breathing room). */
export const HERO_STICKY_TOP_DESKTOP = NAVBAR_HEIGHT + 30;
export const HERO_STICKY_TOP_MOBILE = NAVBAR_HEIGHT + 16;
/** Default block section height (non-hero). */
export const FIRST_SECTION_HEIGHT = '100vh';
/** Hero desert: scroll budget before the next page section (parallax / scene work later). */
export const HERO_FIRST_SECTION_HEIGHT = '150vh';
/** Ground strip under tower (px); keep in sync with `HeroDesertScene` ground height. */
export const HERO_GROUND_STRIP_HEIGHT_PX = 32;
/** Chimney cluster — shared with `HeroDesertScene` (tower size / position). */
export const HERO_CHIMNEY_HEIGHT_CLAMP = 'clamp(200px, 36vh, 368px)';
export const HERO_CHIMNEY_LEFT_CLAMP = 'clamp(8px, 2vw, 28px)';
export const HERO_TOWER_VIEWBOX_H = 208;
/**
 * Hero copy horizontal offset past the pillar (px). Used with `padding: 0` — this is
 * the main left inset instead of padding-left.
 */
export const HERO_COPY_TRANSLATE_X_DESKTOP = 212;
export const HERO_COPY_TRANSLATE_X_MOBILE = 112;
/** Right gutter (px) for hero copy width: `min(MAX_CONTENT_WIDTH, 100% - this)`. */
export const HERO_COPY_RIGHT_GUTTER_DESKTOP = 40;
export const HERO_COPY_RIGHT_GUTTER_MOBILE = 16;
/** Space above the ground strip (px); replaces padding-bottom above the strip. */
export const HERO_COPY_MARGIN_BOTTOM_DESKTOP = HERO_GROUND_STRIP_HEIGHT_PX + 20;
export const HERO_COPY_MARGIN_BOTTOM_MOBILE = HERO_GROUND_STRIP_HEIGHT_PX + 16;
export const NAVBAR_BLUR = 2;
export const MAX_CONTENT_WIDTH = 1440;

// Z-index layers
export const Z_INDEX = {
  navbar: 100,
  themeToggle: 1000,
  modal: 2000,
} as const;

// Breakpoints
export const BREAKPOINTS = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1440px',
} as const;


/**
 * Spacing scale. Uses rem so values scale with the user's base font-size.
 * (Global root font-size is 62.5% so 1rem = 10px by default.)
 */
export const spacing = {
  xs: '0.8rem',
  sm: '1.6rem',
  md: '2.4rem',
  lg: '4rem',
  xl: '6.4rem',
  xxl: '10rem',
} as const;

/** Typography scale. Sizes in rem; line-heights as unitless numbers. */
export const typography = {
  hero:  { size: '8rem',   weight: 700, lineHeight: 1.2 },
  h1:    { size: '6.4rem', weight: 700, lineHeight: 1.3 },
  h2:    { size: '4.8rem', weight: 600, lineHeight: 1.4 },
  h3:    { size: '3.2rem', weight: 600, lineHeight: 1.4 },
  body:  { size: '1.8rem', weight: 400, lineHeight: 1.8 },
  large: { size: '2.4rem', weight: 400, lineHeight: 1.6 },
  small: { size: '1.4rem', weight: 400, lineHeight: 1.6 },
  micro: { size: '1.1rem', weight: 600, lineHeight: 1.4 },
} as const;

/** Standard radii. */
export const radius = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  pill: '999px',
} as const;

/** Light theme — "Ivory Warm". Clean white base with brick-red brand accent. */
export const lightTheme = {
  background:      '#ffffff',
  surface:         '#fdf9f7',
  surfaceElevated: '#f9f3f0',
  navBackground:   'rgba(255, 255, 255, 0.72)',

  text:      '#1a0f10',
  textMuted: '#7f7373',

  primary: {
    100:    '#c4a09b',
    200:    '#f7d9cb',
    200_25: 'rgba(247, 217, 203, 0.25)',
    500:    '#893b36',
    600:    '#7a3331',
  },

  accent:      '#893b36',
  accentHover: '#a84440',
  accentDim:   '#fdf0ec',

  border:       '#eddbd4',
  borderStrong: '#d4b8b0',

  cardBg:   '#fdf9f7',
  shadow:   'rgba(0, 0, 0, 0.08)',
  gridLine: 'rgba(0, 0, 0, 0.04)',

  /** On-accent foreground (always reads as white on coral/brick). */
  onAccent: '#ffffff',
  /** Solid scrim for overlays and gradient stops; dark-by-design. */
  scrim:    'rgba(0, 0, 0, 0.75)',

  /**
   * Flashlight overlay tokens. The beam is black and lands on a white floor
   * oval; the handle matches when open. No full-viewport scrim.
   */
  flashlight: {
    handle:         '#1a0f10',
    handleLit:      '#000000',
    handleLitText:  '#ffffff',
    handleGlow:     'rgba(255, 255, 255, 0.35)',
    beamColor:      '#000000',
    floor:          '#ffffff',
    buttonText:     '#ffffff',
    buttonBorder:   'rgba(255, 255, 255, 0.6)',
    buttonShadow:   'rgba(0, 0, 0, 0.45)',
    buttonHoverBg:  '#ffffff',
    buttonHoverText:'#000000',
  },
};

/** Dark theme — "Ember". Near-black with warm undertones. */
export const darkTheme: typeof lightTheme = {
  background:      '#0d0b0b',
  surface:         '#171212',
  surfaceElevated: '#1f1718',
  navBackground:   'rgba(13, 11, 11, 0.78)',

  text:      '#f2e8e4',
  textMuted: '#9c8884',

  primary: {
    100:    '#9c8884',
    200:    '#3d2020',
    200_25: 'rgba(61, 32, 32, 0.4)',
    500:    '#cc6d62',
    600:    '#bf5e54',
  },

  accent:      '#cc6d62',
  accentHover: '#dc7d72',
  accentDim:   '#3d1a17',

  border:       '#2c1e1e',
  borderStrong: '#3f2a2a',

  cardBg:   '#171212',
  shadow:   'rgba(0, 0, 0, 0.65)',
  gridLine: 'rgba(255, 235, 225, 0.055)',

  onAccent: '#ffffff',
  scrim:    'rgba(0, 0, 0, 0.78)',

  flashlight: {
    handle:         '#1a0f10',
    handleLit:      '#000000',
    handleLitText:  '#ffffff',
    handleGlow:     'rgba(255, 255, 255, 0.35)',
    beamColor:      '#000000',
    floor:          '#ffffff',
    buttonText:     '#ffffff',
    buttonBorder:   'rgba(255, 255, 255, 0.6)',
    buttonShadow:   'rgba(0, 0, 0, 0.45)',
    buttonHoverBg:  '#ffffff',
    buttonHoverText:'#000000',
  },
};

export type Theme = typeof lightTheme;

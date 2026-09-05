import { css } from 'styled-components';

/** Hides a scrollbar across browsers while keeping scrolling functional. */
export const hideScrollbar = css`
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
`;

/** Layered text-shadow used on the hero copy for sandstone depth. */
export const sandstoneTextShadow = css`
  text-shadow:
    -0.035em 0.055em 0 rgba(0, 0, 0, 0.16),
    -0.08em 0.12em 0.5em ${({ theme }) => theme.shadow};
`;

/** Lighter shadow for body copy below the hero headline. */
export const sandstoneBodyShadow = css`
  text-shadow:
    -0.03em 0.05em 0 rgba(0, 0, 0, 0.12),
    -0.06em 0.1em 0.4em ${({ theme }) => theme.shadow};
`;

/** Truncates a single line with an ellipsis. */
export const ellipsis = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/** Truncates multi-line text with an ellipsis after `lines`. */
export const lineClamp = (lines: number) => css`
  display: -webkit-box;
  -webkit-line-clamp: ${lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

/** Reset for native button elements. */
export const buttonReset = css`
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
`;

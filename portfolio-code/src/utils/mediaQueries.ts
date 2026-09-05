import { BREAKPOINTS } from '../constants/layout';

export const mq = {
  mobile: `@media (max-width: ${BREAKPOINTS.mobile})`,
  tablet: `@media (max-width: ${BREAKPOINTS.tablet})`,
  desktop: `@media (max-width: ${BREAKPOINTS.desktop})`,
} as const;

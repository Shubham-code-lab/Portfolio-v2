import { useMemo } from 'react';
import styled from 'styled-components';
import { HERO_TOWER_VIEWBOX_H } from '../../constants/layout';
import { BRICK_CLIP_ID, CASTLE_TOWER_PATH, buildTowerBricks } from './towerBrickwork';

const STROKE_WIDTH = 1.65;
const BRICK_RADIUS = 0.28;
const BRICK_FILL_OPACITY   = 0.14;
const BRICK_STROKE_OPACITY = 0.34;
const BRICK_STROKE_WIDTH   = 0.48;
const BODY_GRADIENT_ID = 'heroTowerBodyGradient';
const SIDE_SHADE_GRADIENT_ID = 'heroTowerSideShadeGradient';
const RIM_GRADIENT_ID = 'heroTowerRimGradient';

export default function ChimneyGraphic() {
  const bricks = useMemo(() => buildTowerBricks(), []);

  return (
    <ChimneySvg
      viewBox={`0 0 100 ${HERO_TOWER_VIEWBOX_H}`}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden
    >
      <defs>
        <clipPath id={BRICK_CLIP_ID}>
          <path d={CASTLE_TOWER_PATH} fill="#fff" />
        </clipPath>
        <linearGradient id={BODY_GRADIENT_ID} x1="20" x2="80" y1="10" y2="206" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.12" />
          <stop offset="0.48" stopColor="currentColor" stopOpacity="0.055" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id={SIDE_SHADE_GRADIENT_ID} x1="18" x2="72" y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="0.52" stopColor="currentColor" stopOpacity="0.015" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.11" />
        </linearGradient>
        <linearGradient id={RIM_GRADIENT_ID} x1="24" x2="76" y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="0.52" stopColor="currentColor" stopOpacity="0.045" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.18" />
        </linearGradient>
      </defs>

      <path d={CASTLE_TOWER_PATH} fill={`url(#${BODY_GRADIENT_ID})`} pointerEvents="none" />

      <g clipPath={`url(#${BRICK_CLIP_ID})`} pointerEvents="none">
        <rect x="10" y="8" width="80" height="200" fill={`url(#${SIDE_SHADE_GRADIENT_ID})`} />
        {bricks.map(brick => (
          <rect
            key={brick.key}
            x={brick.x}
            y={brick.y}
            width={brick.w}
            height={brick.h}
            rx={BRICK_RADIUS}
            ry={BRICK_RADIUS}
            fill="currentColor"
            fillOpacity={BRICK_FILL_OPACITY}
            stroke="currentColor"
            strokeWidth={BRICK_STROKE_WIDTH}
            strokeOpacity={BRICK_STROKE_OPACITY}
          />
        ))}
        <path
          d="M39 76 L45 72 L45 162 L18 188 L18 202 L10 208 L10 188 L38 162 Z"
          fill="currentColor"
          fillOpacity="0.065"
        />
        <path
          d="M61 76 L55 72 L55 162 L82 188 L82 202 L90 208 L90 188 L62 162 Z"
          fill="currentColor"
          fillOpacity="0.105"
        />
      </g>

      <g pointerEvents="none">
        <path
          d="M23 48 H77 M31 29 H77 M35 8 H43 M46 8 H54 M57 8 H65 M68 8 H76"
          fill="none"
          stroke={`url(#${RIM_GRADIENT_ID})`}
          strokeWidth="2.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26 50 L38 74 M74 50 L62 74 M38 162 L12 188 M62 162 L88 188"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeOpacity="0.34"
          strokeLinecap="round"
        />
        <path
          d="M12 205 H88"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.25"
          strokeOpacity="0.22"
          strokeLinecap="round"
        />
      </g>

      <path
        d={CASTLE_TOWER_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </ChimneySvg>
  );
}

const ChimneySvg = styled.svg`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: block;
  color: var(--line);
  transform: translateY(2px);
`;

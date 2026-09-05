import { useMemo } from 'react';
import styled from 'styled-components';
import { HERO_TOWER_VIEWBOX_H } from '../../constants/layout';
import { BRICK_CLIP_ID, CASTLE_TOWER_PATH, buildTowerBricks } from './towerBrickwork';

const STROKE_WIDTH = 1.65;
const BRICK_RADIUS = 0.28;
const BRICK_FILL_OPACITY   = 0.2;
const BRICK_STROKE_OPACITY = 0.38;
const BRICK_STROKE_WIDTH   = 0.48;

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
      </defs>

      <g clipPath={`url(#${BRICK_CLIP_ID})`} pointerEvents="none">
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

import styled, { keyframes } from 'styled-components';
import {
  HERO_STICKY_TOP_DESKTOP,
  HERO_STICKY_TOP_MOBILE,
  HERO_GROUND_STRIP_HEIGHT_PX,
  HERO_CHIMNEY_HEIGHT_CLAMP,
  HERO_CHIMNEY_LEFT_CLAMP,
  HERO_TOWER_VIEWBOX_H,
} from '../constants/layout';
import { mq } from '../utils/mediaQueries';
import ChimneyGraphic from './svg/ChimneyGraphic';
import CloudShape from './svg/CloudShape';

const CLOUD_CYCLE_S   = 28;
const CLOUD_STAGGER_S = CLOUD_CYCLE_S / 3;
const GROUND_H        = HERO_GROUND_STRIP_HEIGHT_PX;

const CLOUD_DELAYS = [
  '0s',
  `-${CLOUD_STAGGER_S}s`,
  `-${2 * CLOUD_STAGGER_S}s`,
] as const;

export default function HeroDesertScene() {
  return (
    <HeroSceneRoot aria-hidden>
      <SkyLayer>
        <ChimneyCluster>
          <ChimneyGraphic />
          {CLOUD_DELAYS.map((delay, index) => (
            <CloudChimneyActor
              key={delay}
              $delay={delay}
              $z={4 + index}
              $left="50%"
              aria-hidden
            >
              <CloudShape />
            </CloudChimneyActor>
          ))}
        </ChimneyCluster>
      </SkyLayer>

      <GroundStrip />
    </HeroSceneRoot>
  );
}

/**
 * The cloud animation: smoke at the chimney → forms → drifts left to right.
 * Vertical leg uses the CSS variable `--cloud-peak-rise` set on ChimneyCluster
 * (it caps near the top of the hero band so clouds never escape the sky strip).
 */
const cloudFromChimney = keyframes`
  0%   { transform: translate(calc(-50% - 18px), 4px) scale(0.22); opacity: 0.45; filter: blur(9px); }
  18%  { transform: translate(calc(-50% + 3vw),  calc(-1 * var(--cloud-peak-rise, 120px) * 0.23)) scale(0.38); opacity: 0.65; filter: blur(6px); }
  38%  { transform: translate(calc(-50% + 14vw), calc(-1 * var(--cloud-peak-rise, 120px) * 0.63)) scale(0.72); opacity: 0.88; filter: blur(2px); }
  52%  { transform: translate(calc(-50% + 26vw), calc(-1 * var(--cloud-peak-rise, 120px))) scale(1.08); opacity: 1; filter: blur(0); }
  72%  { transform: translate(calc(-50% + min(58vw, 820px)),  calc(-1 * var(--cloud-peak-rise, 120px))) scale(1.08); opacity: 1; filter: blur(0) drop-shadow(-3px 5px 10px rgba(0, 0, 0, 0.12)); }
  92%  { transform: translate(calc(-50% + min(96vw, 1320px)), calc(-1 * var(--cloud-peak-rise, 120px))) scale(1.08); opacity: 1; filter: blur(0) drop-shadow(-3px 5px 10px rgba(0, 0, 0, 0.12)); }
  100% { transform: translate(calc(-50% + min(122vw, 1680px)),calc(-1 * var(--cloud-peak-rise, 120px))) scale(1.08); opacity: 1; filter: blur(0); }
`;

/** Fills `HeroStickyViewport` in Home (the sticky wrapper for desert + copy). */
const HeroSceneRoot = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100%;
  --hero-band-h: calc(100dvh - ${HERO_STICKY_TOP_DESKTOP}px);
  pointer-events: none;
  isolation: isolate;
  overflow-x: visible;
  overflow-y: clip;

  ${mq.mobile} {
    --hero-band-h: calc(100dvh - ${HERO_STICKY_TOP_MOBILE}px);
  }
`;

const SkyLayer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: ${GROUND_H}px;
  z-index: 0;
  pointer-events: none;
  overflow-x: visible;
  overflow-y: hidden;
  box-sizing: border-box;
`;

const ChimneyCluster = styled.div`
  position: absolute;
  left: ${HERO_CHIMNEY_LEFT_CLAMP};
  /* Overlap into the ground strip so the brick base reads flush with the floor. */
  bottom: 0;
  box-sizing: border-box;
  height: ${HERO_CHIMNEY_HEIGHT_CLAMP};
  width: auto;
  aspect-ratio: 100 / ${HERO_TOWER_VIEWBOX_H};
  z-index: 3;
  --line: ${({ theme }) => theme.accent};
  /* Chimney top should sit ~20px below the top of the hero band; clamp so
     clouds never leave the sky strip even on tiny viewports. */
  --cloud-peak-rise: min(
    220px,
    max(44px, calc(var(--hero-band-h) - ${GROUND_H}px - ${HERO_CHIMNEY_HEIGHT_CLAMP} - 20px - 48px))
  );
`;

const CloudChimneyActor = styled.div<{ $delay: string; $z: number; $left: string }>`
  position: absolute;
  left: ${({ $left }) => $left};
  bottom: 100%;
  width: clamp(96px, 18vw, 176px);
  height: clamp(62px, 11vw, 104px);
  z-index: ${({ $z }) => $z};
  --cloud-fill:   ${({ theme }) => theme.primary[200_25]};
  --cloud-stroke: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.accent};
  animation: ${cloudFromChimney} ${CLOUD_CYCLE_S}s linear infinite;
  animation-delay: ${({ $delay }) => $delay};
  transform-origin: 50% 100%;
  pointer-events: none;
`;

const GroundStrip = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${GROUND_H}px;
  z-index: 1;
  pointer-events: none;
  background: ${({ theme }) => theme.surfaceElevated};
  border-top: 2px solid ${({ theme }) => theme.borderStrong};
  box-shadow:
    inset 0 2px 0 ${({ theme }) => theme.border},
    0 -6px 18px ${({ theme }) => theme.shadow};
  background-image: repeating-linear-gradient(
    90deg,
    ${({ theme }) => theme.border} 0,
    ${({ theme }) => theme.border} 1px,
    transparent 1px,
    transparent 12px
  );
`;

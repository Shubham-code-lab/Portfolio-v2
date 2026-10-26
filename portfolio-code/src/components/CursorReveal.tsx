import styled from 'styled-components';
import { useCursorSpotlight } from '../hooks/useCursorSpotlight';

/** Spotlight radius (px) when the pointer is over copy with [data-cursor-typography]. */
const RADIUS_OVER_TYPOGRAPHY_PX = 100;
/** Spotlight radius (px) when the pointer is anywhere else inside the wrap. */
const RADIUS_OUTSIDE_PX = 40;
/** Smoothing factor for the follow loop. Higher = snappier. */
const SPOTLIGHT_DAMPING = 0.078;
/** Extra paint area around the stack so large circles are not cut by overflow. */
const REVEAL_LAYER_BLEED_PX = Math.ceil(RADIUS_OVER_TYPOGRAPHY_PX * 1.35);

interface Props {
  normal: React.ReactNode;
  reveal: React.ReactNode;
  className?: string;
  /** When true the spotlight only opens while pointer is over [data-cursor-typography]. */
  revealOnlyOnTypography?: boolean;
}

export default function CursorReveal({
  normal,
  reveal,
  className,
  revealOnlyOnTypography = false,
}: Props) {
  const {
    wrapRef,
    revealRef,
    overTypography,
    handleEnter,
    handleMove,
    handleLeave,
  } = useCursorSpotlight({
    damping:                SPOTLIGHT_DAMPING,
    radiusOverTypography:   RADIUS_OVER_TYPOGRAPHY_PX,
    radiusOutside:          RADIUS_OUTSIDE_PX,
    revealOnlyOnTypography,
  });

  const lensMode      = overTypography ? 'large' : 'small';

  return (
    <Wrap
      ref={wrapRef}
      className={className}
      $circleActive={overTypography}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <Stack>
        <BaseLayer>{normal}</BaseLayer>
        <RevealLayer ref={revealRef} data-lens-mode={lensMode}>
          {reveal}
        </RevealLayer>
      </Stack>
    </Wrap>
  );
}

const Wrap = styled.div<{ $circleActive: boolean }>`
  position: relative;
  cursor: ${({ $circleActive }) => ($circleActive ? 'none' : 'inherit')};
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 100%;
  box-sizing: border-box;
`;
/**
 * One grid cell: base + reveal share the same box.
 * The reveal is painted on top via clip-path; pointer events pass through to base.
 */
const Stack = styled.div`
  position: relative;
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  width: 100%;
  min-height: 0;
  box-sizing: border-box;
  overflow: visible;

  & > * {
    grid-area: 1 / 1;
    min-width: 0;
    min-height: 0;
  }
`;

const BaseLayer = styled.div`
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
`;

const RevealLayer = styled.div`
  position: absolute;
  inset: ${-REVEAL_LAYER_BLEED_PX}px;
  z-index: 6;
  display: flex;
  flex-direction: column;
  /* Bleed the paint past the stack, then pad so copy lines up with the base layer. */
  padding: ${REVEAL_LAYER_BLEED_PX}px;
  pointer-events: none;
  clip-path: circle(0px at 0px 0px);
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.background};
  --pixel-title-shadow-1: ${({ theme }) => theme.accentHover};
  --pixel-title-shadow-2: ${({ theme }) => theme.primary[600]};
  --pixel-title-shadow-3: rgba(0, 0, 0, 0.2);
  --pixel-body-shadow-1: ${({ theme }) => theme.primary[600]};
  --pixel-body-shadow-2: rgba(0, 0, 0, 0.18);
  font: inherit;
  overflow: visible;
  box-sizing: border-box;

  & h1, & p {
    color: ${({ theme }) => theme.background};
  }
`;

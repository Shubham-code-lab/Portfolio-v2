import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCardTransition } from '../contexts/CardTransitionContext';
import { NAVBAR_HEIGHT } from '../constants/layout';

export const TRANSITION_MS = 600;
const BREADCRUMB_H = 36;

/** Top of the hero image when "landed" — shared with ProjectDetail. */
export const HERO_TOP = NAVBAR_HEIGHT + BREADCRUMB_H;

interface ImageGeometry {
  top:    string;
  left:   string;
  width:  string;
  height: string;
  borderRadius: string;
}

const HERO_LANDED_GEOMETRY: ImageGeometry = {
  top:    `${HERO_TOP}px`,
  left:   '0',
  width:  '50vw',
  height: '50vh',
  borderRadius: '0',
};

const toPxOr = (value: number | undefined, fallback: string): string =>
  value === undefined ? fallback : `${value}px`;

const buildGeometry = (rect: DOMRect | null, landed: boolean): ImageGeometry => {
  if (landed) return HERO_LANDED_GEOMETRY;
  return {
    top:    toPxOr(rect?.top,    `${HERO_TOP}px`),
    left:   toPxOr(rect?.left,   '0'),
    width:  toPxOr(rect?.width,  '50vw'),
    height: toPxOr(rect?.height, '50vh'),
    borderRadius: '8px',
  };
};

export default function FlyingImageOverlay() {
  const { card, rect, phase, setPhase, clearTransition } = useCardTransition();
  const [landed, setLanded] = useState(false);

  // fly-in: card rect → hero position
  useEffect(() => {
    if (phase !== 'flying-in') return;
    setLanded(false);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setLanded(true);
      const settleTimer = setTimeout(() => setPhase('landed'), TRANSITION_MS + 60);
      return () => clearTimeout(settleTimer);
    }));
  }, [phase, setPhase]);

  // fly-out: hero position → card rect, then clean up
  useEffect(() => {
    if (phase !== 'flying-out') return;
    setLanded(false);
    const cleanupTimer = setTimeout(() => clearTransition(), TRANSITION_MS + 60);
    return () => clearTimeout(cleanupTimer);
  }, [phase, clearTransition]);

  if (!card || phase === 'idle') return null;

  const geometry = buildGeometry(rect, landed);

  return (
    <>
      <Img
        src={card.image}
        alt={card.title}
        $top={geometry.top}
        $left={geometry.left}
        $width={geometry.width}
        $height={geometry.height}
        $radius={geometry.borderRadius}
      />
      <RightFade  $show={landed} />
      <BottomFade $show={landed} />
    </>
  );
}

interface ImgProps {
  $top:    string;
  $left:   string;
  $width:  string;
  $height: string;
  $radius: string;
}

const Img = styled.img<ImgProps>`
  position: fixed;
  z-index: 500;
  object-fit: cover;
  pointer-events: none;
  top:           ${({ $top })    => $top};
  left:          ${({ $left })   => $left};
  width:         ${({ $width })  => $width};
  height:        ${({ $height }) => $height};
  border-radius: ${({ $radius }) => $radius};
  transition:
    top           ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1),
    left          ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1),
    width         ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1),
    height        ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1),
    border-radius ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1);
`;

interface FadeProps { $show: boolean }

/* Edge fades — visible only after the image has landed. `--bg` is exposed by
   GlobalStyles so the fade tracks the active theme background. */
const Fade = styled.div<FadeProps>`
  position: fixed;
  top: ${HERO_TOP}px;
  left: 0;
  width: 50vw;
  height: 50vh;
  z-index: 501;
  pointer-events: none;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition: opacity 0.3s ease ${({ $show }) => ($show ? `${TRANSITION_MS}ms` : '0ms')};
`;

const RightFade = styled(Fade)`
  background: linear-gradient(to right, transparent 65%, var(--bg) 100%);
`;

const BottomFade = styled(Fade)`
  background: linear-gradient(to bottom, transparent 60%, var(--bg) 100%);
`;

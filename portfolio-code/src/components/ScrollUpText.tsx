import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

/**
 * Block-letter SVG for "SCROLL UP".
 *
 * ViewBox: 0 0 1800 475
 * Each letter occupies a 200 px column; bar thickness = 70 px.
 * Columns: S(0) C(220) R(440) O(660) L(880) L(1100) ·80px gap· U(1380) P(1600)
 *
 * R and P use a hollow bowl: only the outer right wall is drawn (x+130→x+200),
 * leaving a 60 px interior gap that gives the letter its correct shape.
 */
const SCROLL_UP_PATH = [
  // ── S ───────────────────────────────────────────────────────────
  'M 0 0 H 200 V 70 H 0 Z',            // top cap
  'M 0 70 H 70 V 215 H 0 Z',           // left upper arm
  'M 0 215 H 200 V 285 H 0 Z',         // middle bar
  'M 130 285 H 200 V 405 H 130 Z',     // right lower arm
  'M 0 405 H 200 V 475 H 0 Z',         // bottom cap

  // ── C ───────────────────────────────────────────────────────────
  'M 220 0 H 290 V 475 H 220 Z',       // left side
  'M 220 0 H 420 V 70 H 220 Z',        // top cap
  'M 220 405 H 420 V 475 H 220 Z',     // bottom cap

  // ── R ───────────────────────────────────────────────────────────
  'M 440 0 H 510 V 475 H 440 Z',       // left column
  'M 440 0 H 640 V 70 H 440 Z',        // top cap — full width
  'M 570 70 H 640 V 215 H 570 Z',      // bowl right wall only (hollow interior: x=510–570)
  'M 440 215 H 640 V 285 H 440 Z',     // middle bar
  'M 510 285 H 640 V 475 H 510 Z',     // leg

  // ── O ───────────────────────────────────────────────────────────
  'M 660 0 H 860 V 70 H 660 Z',        // top cap
  'M 660 0 H 730 V 475 H 660 Z',       // left side
  'M 790 0 H 860 V 475 H 790 Z',       // right side
  'M 660 405 H 860 V 475 H 660 Z',     // bottom cap

  // ── L ───────────────────────────────────────────────────────────
  'M 880 0 H 950 V 475 H 880 Z',       // left column
  'M 880 405 H 1080 V 475 H 880 Z',    // bottom bar

  // ── L ───────────────────────────────────────────────────────────
  'M 1100 0 H 1170 V 475 H 1100 Z',    // left column
  'M 1100 405 H 1300 V 475 H 1100 Z',  // bottom bar

  // ── U  (word gap — column starts at 1380) ───────────────────────
  'M 1380 0 H 1450 V 405 H 1380 Z',    // left side
  'M 1510 0 H 1580 V 405 H 1510 Z',    // right side
  'M 1380 405 H 1580 V 475 H 1380 Z',  // bottom cap

  // ── P ───────────────────────────────────────────────────────────
  'M 1600 0 H 1670 V 475 H 1600 Z',    // left column
  'M 1600 0 H 1800 V 70 H 1600 Z',     // top cap — full width
  'M 1730 70 H 1800 V 215 H 1730 Z',   // bowl right wall only (hollow interior: x=1670–1730)
  'M 1600 215 H 1800 V 285 H 1600 Z',  // middle bar
].join(' ');

export default function ScrollUpText() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const sectionElement = sectionRef.current;
    if (!sectionElement) return undefined;

    let animationFrameId = 0;

    const updateProgress = () => {
      animationFrameId = 0;

      const viewportHeight = window.innerHeight;
      if (viewportHeight <= 0) {
        setScrollProgress(0);
        return;
      }

      const sectionBounds = sectionElement.getBoundingClientRect();
      const start = viewportHeight;
      const end = viewportHeight * 0.36;
      const rawProgress = (start - sectionBounds.top) / (start - end);
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));

      setScrollProgress(clampedProgress * clampedProgress * (3 - 2 * clampedProgress));
    };

    const scheduleProgressUpdate = () => {
      if (animationFrameId === 0) {
        animationFrameId = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener('scroll', scheduleProgressUpdate, { passive: true });
    window.addEventListener('resize', scheduleProgressUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleProgressUpdate);
      window.removeEventListener('resize', scheduleProgressUpdate);
      if (animationFrameId !== 0) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <ScrollSection ref={sectionRef} $progress={scrollProgress}>
      <ScrollSvg
        viewBox="0 0 1800 475"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Scroll Up"
        role="img"
      >
        <path d={SCROLL_UP_PATH} fill="currentColor" />
      </ScrollSvg>
    </ScrollSection>
  );
}

const ScrollSection = styled.section<{ $progress: number }>`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  color: ${({ theme }) => theme.text};
  --scroll-up-progress: ${({ $progress }) => $progress.toFixed(4)};

  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

/**
 * The SVG height follows scroll progress directly so the footer reverses with
 * the user's motion instead of firing a one-time reveal.
 */
const ScrollSvg = styled.svg`
  width: 100%;
  height: calc(max(0.2rem, 50dvh * var(--scroll-up-progress)));
  display: block;
  opacity: calc(0.18 + (0.82 * var(--scroll-up-progress)));
  transform: translateY(calc((1 - var(--scroll-up-progress)) * 1.2rem));
  transition:
    height 0.18s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.18s ease-out,
    transform 0.18s ease-out;
  will-change: height, opacity, transform;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

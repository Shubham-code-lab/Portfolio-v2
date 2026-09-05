import { useRef } from 'react';
import styled from 'styled-components';
import { useMouseWhenVisible } from '../hooks/useMouseWhenVisible';
import { easeInOut, mapProgress } from '../utils/math';
import { spacing, typography } from '../styles/theme';
import { mq } from '../utils/mediaQueries';

/** Progress band over which the jaws are active (rest before/after). */
const ACTIVE_RANGE = { start: 0.15, end: 0.85 } as const;
/** Phase-1 ends here; Phase-2 (slide-out) runs from here to 1. */
const PHASE_SPLIT = 0.45;

const STATS = [
  { value: '24+',   label: 'Projects'   },
  { value: '3 yrs', label: 'Experience' },
  { value: '12+',   label: 'Clients'    },
  { value: '∞',     label: 'Coffee'     },
] as const;

interface JawGeometry {
  topClipPath:    string;
  bottomClipPath: string;
  topTranslateY:  number;
  bottomTranslateY: number;
}

/**
 * Computes the jaw clip-paths and translations for a given scroll progress.
 *
 * Phase 1 (0 → 0.45): the right edge lifts (top jaw) / drops (bottom jaw),
 *                     left edge stays anchored, mouth opens from the right.
 * Phase 2 (0.45 → 1): the resulting triangles slide off the canvas.
 */
const computeJawGeometry = (rawProgress: number): JawGeometry => {
  const activeProgress = mapProgress(rawProgress, ACTIVE_RANGE.start, ACTIVE_RANGE.end);
  const phase1Progress = easeInOut(mapProgress(activeProgress, 0, PHASE_SPLIT));
  const phase2Progress = easeInOut(mapProgress(activeProgress, PHASE_SPLIT, 1));

  const topRightY    = Math.max(0, 100 - phase1Progress * 100);
  const bottomRightY = Math.min(100, phase1Progress * 100);

  return {
    topClipPath:      `polygon(0% 0%, 100% 0%, 100% ${topRightY}%, 0% 100%)`,
    bottomClipPath:   `polygon(0% 0%, 100% ${bottomRightY}%, 100% 100%, 0% 100%)`,
    topTranslateY:    -(phase2Progress * 100),
    bottomTranslateY:   phase2Progress * 100,
  };
};

export default function ClipReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollProgress } = useMouseWhenVisible(containerRef, { threshold: 0.01 });
  const jaws = computeJawGeometry(scrollProgress);

  return (
    <Outer ref={containerRef}>
      <ContentLayer>
        <ContentTop>
          <Label>About me</Label>
          <Headline>
            Crafting digital
            <br />
            experiences
          </Headline>
        </ContentTop>

        <ContentMid>
          <Body>
            A designer and developer focused on building products that are both
            beautiful and functional. From concept to production, every detail
            matters.
          </Body>
        </ContentMid>

        <ContentBottom>
          {STATS.map(stat => (
            <StatItem key={stat.label}>
              <StatNumber>{stat.value}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatItem>
          ))}
        </ContentBottom>
      </ContentLayer>

      <TopJaw    $clipPath={jaws.topClipPath}    $translateY={jaws.topTranslateY}    />
      <BottomJaw $clipPath={jaws.bottomClipPath} $translateY={jaws.bottomTranslateY} />
    </Outer>
  );
}

const Outer = styled.div`
  position: relative;
  width: 100%;
  height: 50rem;
  overflow: hidden;
  border-radius: 12px;

  ${mq.mobile} {
    height: 46rem;
    border-radius: 8px;
  }
`;

const ContentLayer = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: inherit;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4.4rem 6rem;

  ${mq.mobile} {
    padding: ${spacing.md} ${spacing.md};
  }
`;

const ContentTop = styled.div``;
const ContentMid = styled.div``;

const ContentBottom = styled.div`
  display: flex;
  gap: ${spacing.lg};

  ${mq.mobile} {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
`;

const Label = styled.span`
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.accent};
  margin-bottom: 1.2rem;
`;

const Headline = styled.h2`
  font-size: 4.6rem;
  font-weight: 700;
  line-height: 1.15;
  color: ${({ theme }) => theme.primary[500]};

  ${mq.tablet} { font-size: 3.6rem; }
  ${mq.mobile} { font-size: 2.8rem; }
`;

const Body = styled.p`
  font-size: ${typography.body.size};
  line-height: ${typography.body.lineHeight};
  color: ${({ theme }) => theme.textMuted};
  max-width: 58rem;

  ${mq.mobile} { font-size: 1.4rem; }
`;

const StatItem = styled.div``;

const StatNumber = styled.div`
  font-size: 3.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.accent};
  line-height: 1;
  margin-bottom: 0.5rem;

  ${mq.mobile} { font-size: 2.8rem; }
`;

const StatLabel = styled.div`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.textMuted};
  letter-spacing: 0.04em;
`;

interface JawProps {
  $clipPath:   string;
  $translateY: number;
}

/**
 * The two jaws form one solid block at rest. Each jaw's inner edge is shaped
 * via clip-path so the right side opens first; the left follows.
 */
const TopJaw = styled.div<JawProps>`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 50%;
  background: ${({ theme }) => theme.accent};
  will-change: clip-path, transform;
  clip-path: ${({ $clipPath }) => $clipPath};
  transform: translateY(${({ $translateY }) => $translateY}%);
`;

const BottomJaw = styled(TopJaw)`
  top: auto;
  bottom: 0;
`;

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { easeInOut, mapProgress } from '../utils/math';
import { spacing, typography } from '../styles/theme';
import { mq } from '../utils/mediaQueries';

/** Start opening once this portion of the section is visible. */
const START_VISIBLE_RATIO = 0.7 ;
/** Finish opening when the section bottom sits this far above the viewport bottom. */
const FULLY_VISIBLE_OFFSET_PX = 80;
const FULLY_OPEN_PROGRESS = 0.995;

const STATS = [
  { value: '24+',   label: 'Projects'   },
  { value: '3 yrs', label: 'Experience' },
  { value: '12+',   label: 'Clients'    },
  { value: '∞',     label: 'Coffee'     },
] as const;

const getJawAngle = (openProgress: number): number => easeInOut(openProgress) * 90;

export default function ClipReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openProgress, setOpenProgress] = useState(0);
  const jawAngle = getJawAngle(openProgress);
  const isFullyOpen = openProgress >= FULLY_OPEN_PROGRESS;

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    let rafId: number | null = null;

    const updateProgress = () => {
      const rect = element.getBoundingClientRect();
      const scrolledIntoView = window.innerHeight - rect.top;
      const startVisibleAmount = rect.height * START_VISIBLE_RATIO;
      const fullyVisibleWithOffset = rect.height + FULLY_VISIBLE_OFFSET_PX;

      setOpenProgress(mapProgress(scrolledIntoView, startVisibleAmount, fullyVisibleWithOffset));
      rafId = null;
    };

    const requestUpdate = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

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

      <TopJaw    $angle={-jawAngle} $isFullyOpen={isFullyOpen} />
      <BottomJaw $angle={jawAngle}  $isFullyOpen={isFullyOpen} />
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
  $angle: number;
  $isFullyOpen: boolean;
}

/**
 * The two jaws form one solid block at rest and pivot around the same
 * left-side hinge, opening into a 180-degree spread.
 */
const TopJaw = styled.div<JawProps>`
  position: absolute;
  left: 0;
  top: 0;
  width: 150%;
  height: 50%;
  background: ${({ theme }) => theme.accent};
  transform-origin: left bottom;
  opacity: ${({ $isFullyOpen }) => ($isFullyOpen ? 0 : 1)};
  backface-visibility: hidden;
  box-shadow: 0 0 0 2px ${({ theme }) => theme.accent};
  will-change: transform, opacity;
  transform: rotate(${({ $angle }) => $angle}deg);
`;

const BottomJaw = styled(TopJaw)`
  top: auto;
  bottom: 0;
  transform-origin: left top;
`;

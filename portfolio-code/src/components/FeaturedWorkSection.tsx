import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { CARDS } from '../data/cards';
import { NAVBAR_HEIGHT } from '../constants/layout';
import { radius, spacing, typography } from '../styles/theme';
import { mq } from '../utils/mediaQueries';

const ROLE_LABEL = 'My role';
const ROLE_VALUE = 'Design & frontend';

const STICKY_TOP_PX = NAVBAR_HEIGHT;
const FEATURED_CARDS = CARDS.slice(0, 3);

function formatCount(n: number): string {
  const s = String(n);
  return s.length < 2 ? `0${s}` : s;
}

export default function FeaturedWorkSection() {
  const total = FEATURED_CARDS.length;
  const stackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToCard = (index: number) => {
    const stack = stackRef.current;
    const cardHeight = cardRefs.current[index]?.offsetHeight;
    if (!stack || !cardHeight) return;

    const stackTop = stack.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: stackTop + index * cardHeight - STICKY_TOP_PX + 1,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const updateActiveIndex = () => {
      const stack = stackRef.current;
      const cardHeight = cardRefs.current[0]?.offsetHeight;
      if (!stack || !cardHeight) return;

      const stackTop = stack.getBoundingClientRect().top + window.scrollY;
      const scrolledIntoStack = window.scrollY - stackTop + STICKY_TOP_PX + 8;
      const nextIndex = Math.max(
        0,
        Math.min(total - 1, Math.floor(scrolledIntoStack / cardHeight)),
      );

      setActiveIndex(nextIndex);
    };

    updateActiveIndex();
    window.addEventListener('scroll', updateActiveIndex, { passive: true });
    window.addEventListener('resize', updateActiveIndex);

    return () => {
      window.removeEventListener('scroll', updateActiveIndex);
      window.removeEventListener('resize', updateActiveIndex);
    };
  }, [total]);

  return (
    <Wrap id="projects" data-nav-section="Selected Work" aria-labelledby="featured-work-heading">
      <StackSequence>
        <Intro>
          <Eyebrow>Selected work</Eyebrow>
          <TitleRow>
            <Title id="featured-work-heading">Projects</Title>
            <Count>({formatCount(total)})</Count>
          </TitleRow>
        </Intro>

        <StackShell>
          <Stack ref={stackRef}>
            {FEATURED_CARDS.map((card, index) => {
              const stackIndex = index + 1;
              return (
                <StickyCard
                  key={`${card.title}-${index}`}
                  ref={node => {
                    cardRefs.current[index] = node;
                  }}
                  $stackIndex={stackIndex}
                >
                <CardLink
                  to={`/project/${index}`}
                  data-cursor-label="[ view case ]"
                  $stackIndex={stackIndex}
                >
                  <CardGrid>
                    <TextPane>
                      <Year>{card.year}</Year>
                      <ProjectTitle>{card.title}</ProjectTitle>
                      <Desc>{card.desc}</Desc>
                      <MetaGrid>
                        <MetaBlock>
                          <MetaLabel>Discipline</MetaLabel>
                          <MetaText>{card.tags.join(' · ')}</MetaText>
                        </MetaBlock>
                        <MetaBlock>
                          <MetaLabel>{ROLE_LABEL}</MetaLabel>
                          <MetaText>{card.role ?? ROLE_VALUE}</MetaText>
                        </MetaBlock>
                        <MetaBlock>
                          <MetaLabel>Timeline</MetaLabel>
                          <MetaText>{card.timeline ?? card.year}</MetaText>
                        </MetaBlock>
                      </MetaGrid>
                      <CtaRow>
                        <CtaText>Case study</CtaText>
                        <CtaArrow aria-hidden>-&gt;</CtaArrow>
                      </CtaRow>
                    </TextPane>

                    <VisualPane>
                      <VisualFrame>
                        <VisualImage
                          src={card.image}
                          alt={`${card.title} preview`}
                          loading="lazy"
                          decoding="async"
                        />
                        <OpenPill aria-hidden>&gt; Open</OpenPill>
                      </VisualFrame>
                    </VisualPane>
                  </CardGrid>
                </CardLink>

                <VisualIndexTab aria-hidden $stackIndex={stackIndex}>
                  {formatCount(stackIndex)}
                </VisualIndexTab>
                </StickyCard>
              );
            })}
            <StickyRunway aria-hidden />
          </Stack>

          <IndexRail aria-label="Project quick navigation">
            {FEATURED_CARDS.slice(0, activeIndex + 1).map((card, index) => {
              const stackIndex = index + 1;
              return (
                <IndexButton
                  key={card.title}
                  type="button"
                  onClick={() => scrollToCard(index)}
                  aria-label={`Scroll to project ${formatCount(stackIndex)}: ${card.title}`}
                  $stackIndex={stackIndex}
                >
                  {formatCount(stackIndex)}
                </IndexButton>
              );
            })}
          </IndexRail>
        </StackShell>
      </StackSequence>

      <StackFooter aria-hidden />
    </Wrap>
  );
}

const Wrap = styled.section`
  margin: 0;
  padding-top: clamp(${spacing.md}, 2.5vw, ${spacing.lg});
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const StackSequence = styled.div`
  position: relative;
`;

const Intro = styled.div`
  width: 100%;
  margin-bottom: clamp(${spacing.lg}, 4vw, 5rem);
`;

const Eyebrow = styled.p`
  margin: 0 0 ${spacing.sm};
  font-size: ${typography.body.size};
  line-height: ${typography.body.lineHeight};
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`;

const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  width: 100%;
  gap: ${spacing.sm} ${spacing.md};
`;

const Title = styled.h2`
  margin: 0;
  font-size: clamp(4.8rem, 8vw, 11rem);
  font-weight: ${typography.hero.weight};
  line-height: 1.05;
  color: ${({ theme }) => theme.text};
`;

const Count = styled.span`
  font-size: clamp(2.4rem, 4vw, 5rem);
  font-weight: ${typography.h2.weight};
  color: ${({ theme }) => theme.textMuted};
`;

const StackShell = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 4.4rem;
  align-items: start;
  overflow: visible;

  ${mq.mobile} {
    grid-template-columns: minmax(0, 1fr) 3.2rem;
  }
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

/* A real flow item is required here: sticky positioning clamps against the
   stack's content box, so padding alone does not give the final card runway. */
const StickyRunway = styled.div`
  flex: 0 0 ${NAVBAR_HEIGHT}px;
  width: 100%;
  pointer-events: none;
`;

const StickyCard = styled.section<{ $stackIndex: number }>`
  box-sizing: border-box;
  position: sticky;
  top: ${STICKY_TOP_PX}px;
  display: block;
  min-height: calc(100dvh - ${STICKY_TOP_PX}px);
  margin: 0;
  padding: 0 0 clamp(${spacing.md}, 3vh, ${spacing.lg});
  color: inherit;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  ${mq.mobile} {
    min-height: calc(100dvh - ${STICKY_TOP_PX}px);
    padding-bottom: ${spacing.md};
  }
`;

const CardLink = styled(Link)<{ $stackIndex: number }>`
  position: relative;
  z-index: ${({ $stackIndex }) => $stackIndex};
  display: block;
  text-decoration: none;
  color: inherit;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 4px;
  }
`;

const CardGrid = styled.div`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: minmax(0, 0.42fr) minmax(0, 0.58fr);
  gap: 0;
  height: clamp(
    44rem,
    calc(100dvh - ${STICKY_TOP_PX}px - 12rem),
    60rem
  );
  min-height: 0;
  border-radius: ${radius.md};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 1.2rem 3.2rem ${({ theme }) => theme.shadow};

  ${mq.tablet} {
    grid-template-columns: minmax(0, 0.45fr) minmax(0, 0.55fr);
  }

  ${mq.mobile} {
    grid-template-columns: 1fr;
    height: auto;
    min-height: auto;
  }
`;

const TextPane = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 100%;
  height: 100%;
  padding: clamp(${spacing.md}, 3vw, ${spacing.lg});
  background: ${({ theme }) => theme.surface};
  border-right: 1px solid ${({ theme }) => theme.border};

  ${mq.mobile} {
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    padding: ${spacing.md};
    min-height: auto;
  }
`;

const Year = styled.p`
  margin: 0 0 ${spacing.sm};
  font-size: ${typography.small.size};
  font-weight: ${typography.micro.weight};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`;

const ProjectTitle = styled.h3`
  margin: 0 0 ${spacing.md};
  font-size: clamp(2.4rem, 3vw, ${typography.h2.size});
  font-weight: ${typography.h2.weight};
  line-height: 1.1;
  color: ${({ theme }) => theme.text};
`;

const Desc = styled.p`
  margin: 0 0 ${spacing.lg};
  font-size: ${typography.body.size};
  line-height: ${typography.body.lineHeight};
  color: ${({ theme }) => theme.textMuted};
  max-width: 48rem;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};

  ${mq.tablet} {
    grid-template-columns: 1fr 1fr;
  }

  ${mq.mobile} {
    grid-template-columns: 1fr;
    gap: ${spacing.sm};
    margin-bottom: ${spacing.md};
  }
`;

const MetaBlock = styled.div`
  min-width: 0;
`;

const MetaLabel = styled.span`
  display: block;
  margin-bottom: 0.4rem;
  font-size: ${typography.micro.size};
  font-weight: ${typography.micro.weight};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`;

const MetaText = styled.p`
  margin: 0;
  font-size: ${typography.small.size};
  line-height: 1.5;
  font-weight: ${typography.small.weight};
  color: ${({ theme }) => theme.text};
`;

const CtaRow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: auto;
  padding-top: ${spacing.md};
  font-size: ${typography.body.size};
  font-weight: ${typography.micro.weight};
  color: ${({ theme }) => theme.accent};
`;

const CtaText = styled.span``;

const CtaArrow = styled.span`
  transition: transform 0.25s ease;

  ${CardLink}:hover & {
    transform: translateX(0.35rem);
  }
`;

const VisualPane = styled.div`
  position: relative;
  box-sizing: border-box;
  min-height: 26rem;
  padding: clamp(${spacing.sm}, 2vw, ${spacing.lg});
  background: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  justify-content: center;

  ${mq.mobile} {
    min-height: 28rem;
    padding: ${spacing.md};
  }
`;

const VisualFrame = styled.div`
  position: relative;
  width: 100%;
  max-width: 56rem;
  height: min(40vh, 36rem);
  border-radius: ${radius.sm};
  overflow: hidden;
  box-shadow: 0 2rem 4rem ${({ theme }) => theme.shadow};

  ${mq.mobile} {
    height: min(40vh, 36rem);
  }
`;

const VisualImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const OpenPill = styled.span`
  position: absolute;
  bottom: ${spacing.md};
  left: ${spacing.md};
  padding: 0.6rem 1.2rem;
  font-size: ${typography.micro.size};
  font-weight: ${typography.micro.weight};
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.onAccent};
  background: ${({ theme }) => theme.scrim};
  border-radius: ${radius.pill};
  pointer-events: none;
`;

const VisualIndexTab = styled.span<{ $stackIndex: number }>`
  position: absolute;
  top: calc(0rem + (${({ $stackIndex }) => $stackIndex - 1} * 3.8rem));
  right: -4.4rem;
  z-index: ${({ $stackIndex }) => 80 + $stackIndex};
  width: 4.4rem;
  height: 3.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.border};
  border-left: 0;
  border-radius: 0 ${radius.xs} ${radius.xs} 0;
  background: ${({ theme }) => theme.surfaceElevated};
  color: ${({ theme }) => theme.textMuted};
  font-size: 1.2rem;
  font-weight: ${typography.hero.weight};
  line-height: 1;
  box-shadow:
    -0.35rem 0.35rem 0 ${({ theme }) => theme.shadow},
    inset 0 0 0 1px ${({ theme }) => theme.background};
  pointer-events: none;

  ${mq.mobile} {
    top: calc(0rem + (${({ $stackIndex }) => $stackIndex - 1} * 3rem));
    right: -3.2rem;
    width: 3.2rem;
    height: 3rem;
    font-size: 1rem;
  }
`;

const IndexRail = styled.div`
  position: sticky;
  top: ${STICKY_TOP_PX}px;
  z-index: 100;
  height: calc(100dvh - ${STICKY_TOP_PX}px);
  pointer-events: none;
`;

const IndexButton = styled.button<{ $stackIndex: number }>`
  position: absolute;
  top: calc(0rem + (${({ $stackIndex }) => $stackIndex - 1} * 3.8rem));
  right: 0;
  z-index: ${({ $stackIndex }) => 80 + $stackIndex};
  width: 4.4rem;
  height: 3.8rem;
  border: 0;
  border-radius: 0 ${radius.xs} ${radius.xs} 0;
  background: transparent;
  color: transparent;
  font-size: 1.2rem;
  font-weight: ${typography.hero.weight};
  line-height: 1;
  box-shadow: none;
  pointer-events: auto;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: rgba(0, 0, 0, 0.01);
    outline: none;
  }

  &:focus-visible {
    box-shadow:
      0 0 0 2px ${({ theme }) => theme.background},
      0 0 0 4px ${({ theme }) => theme.accent};
  }

  ${mq.mobile} {
    top: calc(0rem + (${({ $stackIndex }) => $stackIndex - 1} * 3rem));
    width: 3.2rem;
    height: 3rem;
    font-size: 1rem;
  }
`;

const StackFooter = styled.div`
  height: clamp(12rem, 25vh, 20rem);
  pointer-events: none;
`;

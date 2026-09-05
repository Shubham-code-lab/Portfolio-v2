import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { CARDS } from '../data/cards';
import { NAVBAR_HEIGHT } from '../constants/layout';
import { radius, spacing, typography } from '../styles/theme';
import { mq } from '../utils/mediaQueries';

const ROLE_LABEL = 'My role';
const ROLE_VALUE = 'Design & frontend';

const STICKY_TOP_PX = NAVBAR_HEIGHT;

function formatCount(n: number): string {
  const s = String(n);
  return s.length < 2 ? `0${s}` : s;
}

/**
 * Scroll-stacked project panels: each full-viewport slice is `position: sticky` with a
 * higher z-index than the previous so the next project slides over the last (similar in
 * spirit to editorial portfolio stacks). No transform on ancestors of sticky nodes.
 */
export default function FeaturedWorkSection() {
  const total = CARDS.length;

  return (
    <Wrap aria-labelledby="featured-work-heading">
      <Intro>
        <Eyebrow>Selected work</Eyebrow>
        <TitleRow>
          <Title id="featured-work-heading">Projects</Title>
          <Count>({formatCount(total)})</Count>
        </TitleRow>
      </Intro>

      <Stack>
        {CARDS.map((card, index) => {
          const stackIndex = index + 1;
          return (
            <StickyCard
              key={`${card.title}-${index}`}
              to={`/project/${index}`}
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
                      <MetaText>{ROLE_VALUE}</MetaText>
                    </MetaBlock>
                    <MetaBlock>
                      <MetaLabel>Timeline</MetaLabel>
                      <MetaText>{card.year}</MetaText>
                    </MetaBlock>
                  </MetaGrid>
                  <CtaRow>
                    <CtaText>Case study</CtaText>
                    <CtaArrow aria-hidden>→</CtaArrow>
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
                  <IndexBadge>{formatCount(stackIndex)}</IndexBadge>
                </VisualPane>
              </CardGrid>
            </StickyCard>
          );
        })}
      </Stack>

      <StackFooter aria-hidden />
    </Wrap>
  );
}

const Wrap = styled.section`
  margin: clamp(${spacing.xxl}, 8vw, 8rem) 0 0;
  padding-top: clamp(${spacing.lg}, 4vw, ${spacing.xl});
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const Intro = styled.div`
  margin-bottom: clamp(${spacing.lg}, 4vw, ${spacing.xl});
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
  gap: ${spacing.sm} ${spacing.md};
`;

const Title = styled.h2`
  margin: 0;
  font-size: clamp(3.2rem, 5vw, ${typography.h1.size});
  font-weight: ${typography.hero.weight};
  line-height: 1.05;
  color: ${({ theme }) => theme.text};
`;

const Count = styled.span`
  font-size: clamp(2.2rem, 3vw, 3.6rem);
  font-weight: ${typography.h2.weight};
  color: ${({ theme }) => theme.textMuted};
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
`;

/** One scroll “slice”; higher `$stackIndex` paints above the previous while sticky. */
const StickyCard = styled(Link)<{ $stackIndex: number }>`
  box-sizing: border-box;
  position: sticky;
  top: ${STICKY_TOP_PX}px;
  z-index: ${({ $stackIndex }) => $stackIndex};
  display: block;
  min-height: calc(100dvh - ${STICKY_TOP_PX}px);
  margin: 0;
  padding: 0 0 clamp(${spacing.md}, 3vh, ${spacing.lg});
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 4px;
  }

  ${mq.mobile} {
    min-height: calc(100dvh - ${STICKY_TOP_PX}px);
    padding-bottom: ${spacing.md};
  }
`;

const CardGrid = styled.div`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: minmax(0, 0.42fr) minmax(0, 0.58fr);
  gap: 0;
  min-height: calc(100dvh - ${STICKY_TOP_PX}px - clamp(${spacing.md}, 3vh, ${spacing.lg}));
  border-radius: ${radius.md};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 1.2rem 3.2rem ${({ theme }) => theme.shadow};

  ${mq.tablet} {
    grid-template-columns: minmax(0, 0.45fr) minmax(0, 0.55fr);
  }

  ${mq.mobile} {
    grid-template-columns: 1fr;
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
  padding: clamp(${spacing.lg}, 4vw, ${spacing.xl});
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
  ${StickyCard}:hover & {
    transform: translateX(0.35rem);
  }
`;

const VisualPane = styled.div`
  position: relative;
  box-sizing: border-box;
  min-height: 32rem;
  padding: clamp(${spacing.md}, 3vw, ${spacing.xl});
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
  height: min(52vh, 48rem);
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

/** Same right rail on every slice so indices line up as panels stack. */
const IndexBadge = styled.span`
  position: absolute;
  top: 50%;
  right: clamp(${spacing.sm}, 2vw, ${spacing.md});
  transform: translateY(-50%);
  width: 4.8rem;
  height: 4.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: ${typography.hero.weight};
  line-height: 1;
  color: ${({ theme }) => theme.onAccent};
  background: ${({ theme }) => theme.accent};
  border-radius: ${radius.xs};
  pointer-events: none;
  box-shadow: 0 0.4rem 1.2rem ${({ theme }) => theme.shadow};

  ${mq.mobile} {
    top: auto;
    bottom: ${spacing.md};
    right: ${spacing.md};
    transform: none;
    width: 4rem;
    height: 4rem;
    font-size: 1.5rem;
  }
`;

/** Extra scroll room so the last panel can release from sticky cleanly. */
const StackFooter = styled.div`
  height: clamp(12rem, 25vh, 20rem);
  pointer-events: none;
`;

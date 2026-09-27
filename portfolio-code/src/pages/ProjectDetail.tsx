import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { CARDS } from '../data/cards';
import { useCardTransition } from '../contexts/CardTransitionContext';
import { HERO_TOP, TRANSITION_MS } from '../components/FlyingImageOverlay';
import { NAVBAR_HEIGHT } from '../constants/layout';
import { mq } from '../utils/mediaQueries';
import Breadcrumb from './projectDetail/Breadcrumb';

const BREADCRUMB_H = 36;
const CONTENT_TOP  = NAVBAR_HEIGHT + BREADCRUMB_H;
/** Delay (ms) added on top of TRANSITION_MS so opacity ramps after the image lands. */
const POST_LAND_FADE_MS  = 60;
const TEXT_POST_LAND_MS  = 80;

const resolveCardIndex = (rawId: string | undefined): number => {
  const numericId = Number(rawId ?? 0);
  if (!Number.isFinite(numericId)) return 0;
  return Math.max(0, Math.min(CARDS.length - 1, numericId));
};

export default function ProjectDetail() {
  const { id }                             = useParams<{ id: string }>();
  const navigate                           = useNavigate();
  const { card: ctxCard, phase, setPhase } = useCardTransition();

  const cardIndex = resolveCardIndex(id);
  const card      = ctxCard ?? CARDS[cardIndex];
  const visible   = phase === 'landed';

  const handleBack = useCallback((): void => {
    setPhase('flying-out');
    navigate(-1);
  }, [navigate, setPhase]);

  return (
    <PageWrap>
      <TopBar $visible={visible}>
        <Breadcrumb currentLabel={card.title} onBack={handleBack} />
      </TopBar>

      <RightPanel $visible={visible}>
        <Title>{card.title}</Title>

        <MetaRow>
          <MetaRating>{card.status ?? `★ ${card.rating}`}</MetaRating>
          <MetaYear>{card.year}</MetaYear>
          {card.tags.map(tag => <MetaTag key={tag}>{tag}</MetaTag>)}
        </MetaRow>

        <Section>
          <SectionLabel>Overview</SectionLabel>
          <SectionText>{card.desc}</SectionText>
        </Section>

        <Section>
          <SectionLabel>My role</SectionLabel>
          {card.role ? <SectionText>{card.role}</SectionText> : <Placeholder>— coming soon —</Placeholder>}
        </Section>

        <Section>
          <SectionLabel>What I built</SectionLabel>
          {card.highlights?.length ? (
            <HighlightList>
              {card.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}
            </HighlightList>
          ) : (
            <Placeholder>— coming soon —</Placeholder>
          )}
        </Section>

        <Section>
          <SectionLabel>Tech stack</SectionLabel>
          {card.techStack?.length ? (
            <TechList>
              {card.techStack.map(technology => <TechItem key={technology}>{technology}</TechItem>)}
            </TechList>
          ) : (
            <Placeholder>— coming soon —</Placeholder>
          )}
        </Section>

        <Section>
          <SectionLabel>Links</SectionLabel>
          {card.links?.length ? (
            <LinkList>
              {card.links.map(link => (
                <ProjectLink key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}<span aria-hidden>↗</span>
                </ProjectLink>
              ))}
            </LinkList>
          ) : (
            <Placeholder>— coming soon —</Placeholder>
          )}
        </Section>
      </RightPanel>
    </PageWrap>
  );
}

const PageWrap = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
`;

const TopBar = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: ${NAVBAR_HEIGHT}px;
  left: 0;
  right: 0;
  height: ${BREADCRUMB_H}px;
  z-index: 250;
  display: flex;
  align-items: center;
  padding: 0 2.2rem;
  background: ${({ theme }) => theme.surface};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.3s ease ${({ $visible }) =>
    $visible ? `${TRANSITION_MS + POST_LAND_FADE_MS}ms` : '0ms'};
`;

const RightPanel = styled.div<{ $visible: boolean }>`
  margin-left: 50vw;
  min-height: 100vh;
  padding: ${CONTENT_TOP + 36}px 5.2rem 12rem 4.4rem;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.4s ease ${({ $visible }) =>
    $visible ? `${TRANSITION_MS + TEXT_POST_LAND_MS}ms` : '0ms'};

  ${mq.mobile} {
    margin-left: 0;
    margin-top: calc(${HERO_TOP}px + 50vh);
    padding: 2.8rem 2.4rem 8rem;
  }
`;

const Title = styled.h1`
  font-size: clamp(2.6rem, 4vw, 4.8rem);
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  line-height: 1.08;
  margin: 0 0 1.4rem;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-bottom: 4rem;
`;

const MetaRating = styled.span`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.accent};
`;

const MetaYear = styled.span`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.textMuted};
`;

const MetaTag = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  padding: 2px 8px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const Section = styled.div`
  border-top: 1px solid ${({ theme }) => theme.border};
  padding: 2.8rem 0;
`;

const SectionLabel = styled.div`
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 1.2rem;
`;

const SectionText = styled.p`
  font-size: 1.5rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const HighlightList = styled.ul`
  display: grid;
  gap: 1.2rem;
  margin: 0;
  padding-left: 2rem;
  color: ${({ theme }) => theme.text};
  font-size: 1.4rem;
  line-height: 1.7;

  li::marker {
    color: ${({ theme }) => theme.accent};
  }
`;

const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const TechItem = styled.span`
  padding: 0.7rem 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 999px;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 1.1rem;
  font-weight: 600;
`;

const LinkList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ProjectLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 1rem 1.4rem;
  border: 1px solid ${({ theme }) => theme.accent};
  border-radius: 6px;
  color: ${({ theme }) => theme.accent};
  font-size: 1.2rem;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s ease, background 0.2s ease;

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.onAccent};
    background: ${({ theme }) => theme.accent};
  }
`;

const Placeholder = styled.div`
  height: 9rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.surface};
  border: 1px dashed ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.textMuted};
  letter-spacing: 0.05em;
`;

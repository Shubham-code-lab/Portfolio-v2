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

const SECTIONS = [
  { label: 'Tech Stack', placeholder: '— coming soon —' },
  { label: 'Gallery',    placeholder: '— coming soon —' },
  { label: 'Links',      placeholder: '— coming soon —' },
] as const;

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
          <MetaRating>★ {card.rating}</MetaRating>
          <MetaYear>{card.year}</MetaYear>
          {card.tags.map(tag => <MetaTag key={tag}>{tag}</MetaTag>)}
        </MetaRow>

        <Section>
          <SectionLabel>Overview</SectionLabel>
          <SectionText>{card.desc}</SectionText>
        </Section>

        {SECTIONS.map(section => (
          <Section key={section.label}>
            <SectionLabel>{section.label}</SectionLabel>
            <Placeholder>{section.placeholder}</Placeholder>
          </Section>
        ))}
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

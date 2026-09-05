import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CARDS } from '../data/cards';
import type { CardData } from '../types/card';
import { useCardTransition } from '../contexts/CardTransitionContext';
import { useInfiniteCarousel } from '../hooks/useInfiniteCarousel';
import { CAROUSEL_LAYOUT } from '../constants/carousel';
import { spacing } from '../styles/theme';
import { mq } from '../utils/mediaQueries';
import { hideScrollbar } from '../styles/mixins';
import CarouselCard from './carousel/CarouselCard';
import CarouselArrow from './carousel/CarouselArrow';

const { gap, expandPadding, detailHeight } = CAROUSEL_LAYOUT;
/** Vertical bleed inside the scroll track so scaled cards are not clipped (px). */
const TRACK_SCROLL_BLEED_PX = 185;
/** Horizontal bleed only — smaller than vertical so the row does not spill past the viewport. */
const TRACK_SCROLL_INSET_REM = 2.4;

/** Render the card list 3x so we can swap scrollLeft to the middle copy and
 *  appear infinite without observable jumps. */
const buildCircularCards = (cards: readonly CardData[]): readonly CardData[] => [
  ...cards,
  ...cards,
  ...cards,
];

export default function CardScroll() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const { setTransition, setPhase } = useCardTransition();

  const { trackRef, scrollByDirection, handleScroll } = useInfiniteCarousel({
    itemCount: CARDS.length,
    gapPx: gap,
  });

  const circularCards = useMemo(() => buildCircularCards(CARDS), []);

  const goToCard = useCallback((card: CardData, indexInCircle: number, event: React.MouseEvent<HTMLDivElement>): void => {
    const rect       = event.currentTarget.getBoundingClientRect();
    const cardOffset = indexInCircle % CARDS.length;
    setTransition(card, rect);
    setPhase('flying-in');
    navigate(`/project/${cardOffset}`);
  }, [navigate, setPhase, setTransition]);

  const clearHover = useCallback(() => setHoveredIndex(null), []);
  const scrollLeft  = useCallback(() => scrollByDirection('left'),  [scrollByDirection]);
  const scrollRight = useCallback(() => scrollByDirection('right'), [scrollByDirection]);

  return (
    <CarouselContainer>
      <CarouselHeader>
        <CarouselTitle>Projects</CarouselTitle>
        <CarouselLabel>{CARDS.length} works</CarouselLabel>
      </CarouselHeader>

      <CarouselViewport>
        <CarouselArrow direction="left" onClick={scrollLeft} />
        <CarouselWrapper>
          <CarouselTrack ref={trackRef} onScroll={handleScroll}>
            {circularCards.map((card, index) => {
              const uniqueOffset = index % CARDS.length;
              const isMiddleCopy = index >= CARDS.length && index < CARDS.length * 2;
              const eager = isMiddleCopy && uniqueOffset < 5;

              return (
                <CarouselCard
                  key={index}
                  card={card}
                  eager={eager}
                  isHovered={hoveredIndex === index}
                  onHoverIn={() => setHoveredIndex(index)}
                  onHoverOut={clearHover}
                  onClick={event => goToCard(card, index, event)}
                />
              );
            })}
          </CarouselTrack>
        </CarouselWrapper>
        <CarouselArrow direction="right" onClick={scrollRight} />
      </CarouselViewport>
    </CarouselContainer>
  );
}

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: ${spacing.xl} 0 clamp(${spacing.xxl}, 6vw, 6rem);
  overflow-x: clip;
`;

const CarouselHeader = styled.div`
  padding: 0 0 ${spacing.lg};
  display: flex;
  align-items: baseline;
  gap: ${spacing.sm};
`;

const CarouselViewport = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
  gap: clamp(${spacing.sm}, 2vw, ${spacing.md});
  width: 100%;
  max-width: 100%;
  min-width: 0;
`;

const CarouselTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary[500]};

  ${mq.mobile} { font-size: 2.2rem; }
`;

const CarouselLabel = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`;

/* Padding + negative margin pair so the card-expansion area does not push
   surrounding layout. The matching pair on CarouselTrack creates the visual
   room cards need to scale on hover without being clipped. */
const CarouselWrapper = styled.div`
  position: relative;
  z-index: 0;
  flex: 1;
  min-width: 0;
  max-width: 100%;
  padding: ${expandPadding}px 0 ${expandPadding + detailHeight}px;
  overflow-x: clip;
  overflow-y: visible;
  margin-top: -${expandPadding}px;
  margin-bottom: -${expandPadding + detailHeight}px;
  isolation: isolate;
`;

const CarouselTrack = styled.div`
  display: flex;
  gap: ${gap}px;
  overflow-x: auto;
  overflow-y: visible;
  padding:
    ${TRACK_SCROLL_BLEED_PX}px ${TRACK_SCROLL_INSET_REM}rem
    ${TRACK_SCROLL_BLEED_PX + detailHeight}px;
  margin:
    -${TRACK_SCROLL_BLEED_PX}px -${TRACK_SCROLL_INSET_REM}rem
    -${TRACK_SCROLL_BLEED_PX + detailHeight}px -${TRACK_SCROLL_INSET_REM}rem;
  max-width: none;
  box-sizing: border-box;
  ${hideScrollbar};
`;

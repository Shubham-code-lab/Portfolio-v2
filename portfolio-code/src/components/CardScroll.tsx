import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CARDS } from '../data/cards';
import type { CardData } from '../types/card';
import { useCardTransition } from '../contexts/CardTransitionContext';
import { useInfiniteCarousel } from '../hooks/useInfiniteCarousel';
import { CAROUSEL_LAYOUT } from '../constants/carousel';
import { hideScrollbar } from '../styles/mixins';
import CarouselCard from './carousel/CarouselCard';

const { gap, expandPadding, detailHeight } = CAROUSEL_LAYOUT;
/** Vertical bleed inside the scroll track so scaled cards are not clipped (px). */
const TRACK_SCROLL_BLEED_PX = 185;
/** Horizontal bleed only — smaller than vertical so the row does not spill past the viewport. */
const TRACK_SCROLL_INSET_PX = 20;

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

  const { trackRef, handleScroll, shouldSuppressClick } = useInfiniteCarousel({
    itemCount: CARDS.length,
    gapPx: gap,
  });

  const circularCards = useMemo(() => buildCircularCards(CARDS), []);

  const goToCard = useCallback((card: CardData, indexInCircle: number, event: React.MouseEvent<HTMLDivElement>): void => {
    if (shouldSuppressClick()) return;
    const rect       = event.currentTarget.getBoundingClientRect();
    const cardOffset = indexInCircle % CARDS.length;
    setTransition(card, rect);
    setPhase('flying-in');
    navigate(`/project/${cardOffset}`);
  }, [navigate, setPhase, setTransition, shouldSuppressClick]);

  const clearHover = useCallback(() => setHoveredIndex(null), []);

  return (
    <CarouselContainer
      id="project-carousel"
      data-nav-section="Projects"
      $hasHoveredCard={hoveredIndex !== null}
    >
      <CarouselViewport>
        <CarouselWrapper>
          <CarouselTrack
            ref={trackRef}
            data-cursor-state="move"
            onScroll={handleScroll}
            tabIndex={0}
            role="region"
            aria-label="Projects carousel; drag or use arrow keys to browse"
          >
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
      </CarouselViewport>
    </CarouselContainer>
  );
}

const CarouselContainer = styled.div<{ $hasHoveredCard: boolean }>`
  position: relative;
  z-index: ${({ $hasHoveredCard }) => ($hasHoveredCard ? 80 : 1)};
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding-block: 0;
  overflow-x: clip;
  transition: z-index 0s;
`;

const CarouselViewport = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;
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
    ${TRACK_SCROLL_BLEED_PX}px ${TRACK_SCROLL_INSET_PX}px
    ${TRACK_SCROLL_BLEED_PX + detailHeight}px;
  margin:
    -${TRACK_SCROLL_BLEED_PX}px 0
    -${TRACK_SCROLL_BLEED_PX + detailHeight}px;
  max-width: none;
  box-sizing: border-box;
  cursor: grab;
  touch-action: pan-x pan-y;
  user-select: none;

  &[data-dragging='true'] {
    cursor: grabbing;
  }
  ${hideScrollbar};
`;

import { memo } from 'react';
import styled from 'styled-components';
import type { CardData } from '../../types/card';
import { CAROUSEL_LAYOUT, HOVER_SCALE } from '../../constants/carousel';
import { mq } from '../../utils/mediaQueries';
import { ellipsis, lineClamp } from '../../styles/mixins';

const { cardWidth, imageHeight, expandPadding, detailHeight } = CAROUSEL_LAYOUT;
const CARD_INLINE_BLEED_PX = 8;

interface Props {
  card:        CardData;
  isHovered:   boolean;
  eager:       boolean;
  onHoverIn:   () => void;
  onHoverOut:  () => void;
  onClick:     (event: React.MouseEvent<HTMLDivElement>) => void;
}

function CarouselCard({ card, isHovered, eager, onHoverIn, onHoverOut, onClick }: Props) {
  return (
    <CardWrapper data-carousel-card $isHovered={isHovered}>
      <Card
        data-carousel-card-surface
        data-cursor-label="[ view case ]"
        $isHovered={isHovered}
        onMouseEnter={onHoverIn}
        onMouseLeave={onHoverOut}
        onClick={onClick}
      >
        <ImageWrap $isHovered={isHovered}>
          <CardImage
            src={card.image}
            alt={card.title}
            draggable={false}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={eager ? 'high' : 'low'}
          />
        </ImageWrap>

        <CardOverlay>
          <OverlayMeta>★ {card.rating} · {card.year}</OverlayMeta>
        </CardOverlay>

        <CardDetailPanel $isHovered={isHovered}>
          <DetailInner>
            <DetailTitle>{card.title}</DetailTitle>
            <DetailRow>
              <DetailRating>★ {card.rating}</DetailRating>
              <DetailDot>·</DetailDot>
              <DetailYear>{card.year}</DetailYear>
              <DetailDot>·</DetailDot>
              {card.tags.map(tag => <DetailTag key={tag}>{tag}</DetailTag>)}
            </DetailRow>
            <DetailDesc>{card.desc}</DetailDesc>
            <DetailMetaGrid>
              <DetailMetaItem>
                <span>Format</span>
                <strong>Digital story</strong>
              </DetailMetaItem>
              <DetailMetaItem>
                <span>Focus</span>
                <strong>{card.tags[0]}</strong>
              </DetailMetaItem>
              <DetailMetaItem>
                <span>Status</span>
                <strong>Archive select</strong>
              </DetailMetaItem>
            </DetailMetaGrid>
          </DetailInner>
        </CardDetailPanel>
      </Card>
    </CardWrapper>
  );
}

export default memo(CarouselCard);

const CardWrapper = styled.div<{ $isHovered: boolean }>`
  flex: 0 0 ${cardWidth + CARD_INLINE_BLEED_PX * 2}px;
  width: ${cardWidth + CARD_INLINE_BLEED_PX * 2}px;
  position: relative;
  z-index: ${({ $isHovered }) => ($isHovered ? 80 : 1)};
  /* padding/negative-margin trick: gives each card its own expansion area
     without disturbing the surrounding layout flow. */
  padding: ${expandPadding}px ${CARD_INLINE_BLEED_PX}px;
  margin: -${expandPadding}px -${CARD_INLINE_BLEED_PX}px;

  ${mq.mobile} {
    flex-basis: calc(min(${cardWidth}px, 100vw - 40px) + ${CARD_INLINE_BLEED_PX * 2}px);
    width: calc(min(${cardWidth}px, 100vw - 40px) + ${CARD_INLINE_BLEED_PX * 2}px);
  }
`;

const Card = styled.div<{ $isHovered: boolean }>`
  position: relative;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
  transform: ${({ $isHovered }) => ($isHovered ? `scale(${HOVER_SCALE})` : 'scale(1)')};
  z-index: ${({ $isHovered }) => ($isHovered ? 50 : 1)};
  box-shadow: ${({ $isHovered, theme }) =>
    $isHovered
      ? `0 24px 48px ${theme.shadow}`
      : `0 2px 8px ${theme.shadow}`};
  will-change: transform;
  overflow: visible;
`;

const ImageWrap = styled.div<{ $isHovered: boolean }>`
  overflow: hidden;
  border-radius: ${({ $isHovered }) => ($isHovered ? '8px 8px 0 0' : '8px')};
  transition: border-radius 0.15s ease;
`;

const CardImage = styled.img`
  width: 100%;
  height: ${imageHeight}px;
  object-fit: cover;
  display: block;
`;

const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${imageHeight}px;
  background: linear-gradient(to top, ${({ theme }) => theme.scrim} 0%, transparent 55%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  pointer-events: none;
  border-radius: 8px 8px 0 0;
`;

const OverlayMeta = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.onAccent};
  opacity: 0.9;
  letter-spacing: 0.04em;
`;

/** Absolute so it never affects layout height; expands downward on hover. */
const CardDetailPanel = styled.div<{ $isHovered: boolean }>`
  position: absolute;
  top: ${imageHeight}px;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-top: none;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  max-height: ${({ $isHovered }) => ($isHovered ? `${detailHeight}px` : '0')};
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
`;

const DetailInner = styled.div`
  padding: 1rem 1.1rem 1.2rem;
`;

const DetailTitle = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary[500]};
  margin-bottom: 0.5rem;
  ${ellipsis};
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.7rem;
`;

const DetailRating = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.accent};
`;

const DetailYear = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.textMuted};
`;

const DetailDot = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.border};
`;

const DetailTag = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 3px;
  padding: 1px 5px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DetailDesc = styled.p`
  font-size: 1rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.textMuted};
  margin: 0 0 0.9rem;
  ${lineClamp(2)};
`;

const DetailMetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
  padding-top: 0.8rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const DetailMetaItem = styled.div`
  min-width: 0;

  span,
  strong {
    display: block;
    ${ellipsis};
  }

  span {
    margin-bottom: 0.25rem;
    color: ${({ theme }) => theme.textMuted};
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  strong {
    color: ${({ theme }) => theme.text};
    font-size: 0.9rem;
    font-weight: 600;
  }
`;

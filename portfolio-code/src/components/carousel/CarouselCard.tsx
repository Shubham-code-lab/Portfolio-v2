import { memo } from 'react';
import styled from 'styled-components';
import type { CardData } from '../../types/card';
import { CAROUSEL_LAYOUT, HOVER_SCALE } from '../../constants/carousel';
import { mq } from '../../utils/mediaQueries';
import { ellipsis, lineClamp } from '../../styles/mixins';

const { gap, imageHeight, expandPadding, detailHeight } = CAROUSEL_LAYOUT;

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
    <CardWrapper
      data-carousel-card
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      <Card $isHovered={isHovered} onClick={onClick}>
        <ImageWrap $isHovered={isHovered}>
          <CardImage
            src={card.image}
            alt={card.title}
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
          </DetailInner>
        </CardDetailPanel>
      </Card>
    </CardWrapper>
  );
}

export default memo(CarouselCard);

const CardWrapper = styled.div`
  flex: 0 0 calc(20% - ${gap}px);
  min-width: 25rem;
  position: relative;
  /* padding/negative-margin trick: gives each card its own expansion area
     without disturbing the surrounding layout flow. */
  padding: ${expandPadding}px 8px;
  margin: -${expandPadding}px -8px;

  @media (max-width: 1200px) { flex: 0 0 calc(25% - ${gap}px); }
  ${mq.mobile} { flex: 0 0 calc(33.333% - ${gap}px); min-width: 20rem; }
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
  margin: 0;
  ${lineClamp(3)};
`;

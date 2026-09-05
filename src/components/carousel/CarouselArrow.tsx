import styled from 'styled-components';
import ChevronIcon from '../svg/ChevronIcon';
import { buttonReset } from '../../styles/mixins';
import { mq } from '../../utils/mediaQueries';

interface Props {
  direction: 'left' | 'right';
  onClick:   () => void;
}

export default function CarouselArrow({ direction, onClick }: Props) {
  const label = direction === 'left' ? 'Scroll left' : 'Scroll right';
  return (
    <ArrowButton $direction={direction} onClick={onClick} aria-label={label}>
      <ChevronIcon direction={direction} />
    </ArrowButton>
  );
}

const ArrowButton = styled.button<{ $direction: 'left' | 'right' }>`
  ${buttonReset};
  flex-shrink: 0;
  align-self: center;
  background: ${({ theme }) => theme.scrim};
  backdrop-filter: blur(10px);
  color: ${({ theme }) => theme.onAccent};
  width: clamp(4.4rem, 5vw, 5.6rem);
  min-height: 12rem;
  position: relative;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease;
  border-radius: ${({ $direction }) =>
    $direction === 'left' ? '0.8rem 0.4rem 0.4rem 0.8rem' : '0.4rem 0.8rem 0.8rem 0.4rem'};
  border: 1px solid ${({ theme }) => theme.border};

  &:hover {
    background: ${({ theme }) => theme.surfaceElevated};
    transform: scale(1.03);
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 2.4rem;
    height: 2.4rem;
    fill: currentColor;
  }

  ${mq.mobile} {
    min-height: 9.6rem;
    width: 4rem;
  }
`;

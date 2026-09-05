import { useCallback, useEffect, useRef } from 'react';

interface InfiniteCarouselConfig {
  /** Number of unique cards in one logical "set" (we render 3 sets back-to-back). */
  itemCount: number;
  /** Pixel gap between cards — needed so we can measure one set's width accurately. */
  gapPx: number;
}

interface InfiniteCarouselApi {
  trackRef: React.RefObject<HTMLDivElement | null>;
  scrollByDirection: (direction: 'left' | 'right') => void;
  handleScroll: () => void;
}

const CARD_SELECTOR = '[data-carousel-card]';
const SCROLL_PAGE_FRACTION = 0.8;

/**
 * Drives a "rendered three times" infinite carousel.
 * The track contains N items repeated 3x; the scroll position is jumped one set
 * forward/back when the user reaches an end so the loop appears seamless.
 */
export const useInfiniteCarousel = (config: InfiniteCarouselConfig): InfiniteCarouselApi => {
  const { itemCount, gapPx } = config;
  const trackRef     = useRef<HTMLDivElement>(null);
  const setWidthRef  = useRef(0);
  const isJumpingRef = useRef(false);

  const measureSetWidth = useCallback((): number => {
    const track = trackRef.current;
    if (!track) return 0;

    const cards = track.querySelectorAll(CARD_SELECTOR);
    if (cards.length < itemCount) return 0;

    let totalWidth = 0;
    for (let index = 0; index < itemCount; index += 1) {
      const card = cards[index];
      if (!(card instanceof HTMLElement)) continue;
      const isLast = index === itemCount - 1;
      totalWidth += card.offsetWidth + (isLast ? 0 : gapPx);
    }
    return totalWidth;
  }, [itemCount, gapPx]);

  const scrollByDirection = useCallback((direction: 'left' | 'right'): void => {
    const track = trackRef.current;
    if (!track) return;
    const amount = track.clientWidth * SCROLL_PAGE_FRACTION;
    const left   = direction === 'left' ? -amount : amount;
    track.scrollBy({ left, behavior: 'auto' });
  }, []);

  const handleScroll = useCallback((): void => {
    const track = trackRef.current;
    if (!track || isJumpingRef.current) return;

    const setWidth = setWidthRef.current;
    if (setWidth <= 0) return;

    const { scrollLeft, clientWidth } = track;
    const reachedEnd   = scrollLeft >= setWidth * 2 - clientWidth;
    const reachedStart = scrollLeft <= 0;
    if (!reachedEnd && !reachedStart) return;

    const offset = reachedEnd ? -setWidth : setWidth;
    isJumpingRef.current = true;
    requestAnimationFrame(() => {
      const node = trackRef.current;
      if (node) node.scrollLeft = scrollLeft + offset;
      requestAnimationFrame(() => { isJumpingRef.current = false; });
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const initialise = (): void => {
      const width = measureSetWidth();
      if (width <= 0) return;
      setWidthRef.current = width;
      track.scrollLeft = width;
    };
    initialise();

    const observer = new ResizeObserver(() => {
      const width = measureSetWidth();
      if (width > 0) setWidthRef.current = width;
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, [measureSetWidth]);

  return { trackRef, scrollByDirection, handleScroll };
};

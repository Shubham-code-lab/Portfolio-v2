import { useCallback, useEffect, useRef } from 'react';

interface InfiniteCarouselConfig {
  /** Number of unique cards in one logical "set" (we render 3 sets back-to-back). */
  itemCount: number;
  /** Pixel gap between cards — needed so we can measure one set's width accurately. */
  gapPx: number;
}

interface InfiniteCarouselApi {
  trackRef: React.RefObject<HTMLDivElement | null>;
  handleScroll: () => void;
  shouldSuppressClick: () => boolean;
}

const CARD_SELECTOR = '[data-carousel-card]';
const CARD_SURFACE_SELECTOR = '[data-carousel-card-surface]';
const AUTOPLAY_SPEED_PX_PER_SECOND = 120;
const DRAG_THRESHOLD_PX = 5;
const DRAG_CLICK_SUPPRESSION_MS = 300;
const INTERACTION_IDLE_MS = 900;

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
  const isPausedRef = useRef(false);
  const isCardHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);
  const suppressClickUntilRef = useRef(0);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);

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
      const styles = window.getComputedStyle(card);
      const marginWidth = Number.parseFloat(styles.marginLeft) + Number.parseFloat(styles.marginRight);
      totalWidth += card.offsetWidth + marginWidth + (isLast ? 0 : gapPx);
    }
    return totalWidth;
  }, [itemCount, gapPx]);

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

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationFrame = 0;
    let previousTime = performance.now();
    let resumeTimer: number | null = null;

    const animate = (time: number): void => {
      const elapsedSeconds = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      if (!isPausedRef.current && !isDraggingRef.current) {
        track.scrollLeft += AUTOPLAY_SPEED_PX_PER_SECOND * elapsedSeconds;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    const pause = (): void => {
      if (resumeTimer !== null) {
        window.clearTimeout(resumeTimer);
        resumeTimer = null;
      }
      isPausedRef.current = true;
    };

    const resumeAfterIdle = (): void => {
      if (resumeTimer !== null) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        resumeTimer = null;
        if (isCardHoveredRef.current || isDraggingRef.current) return;
        previousTime = performance.now();
        isPausedRef.current = false;
      }, INTERACTION_IDLE_MS);
    };

    const handleHoverPointerMove = (event: PointerEvent): void => {
      if (event.pointerType !== 'mouse' || isDraggingRef.current) return;
      const pointedElement = document.elementFromPoint(event.clientX, event.clientY);
      const cardSurface = pointedElement?.closest(CARD_SURFACE_SELECTOR);
      const isOverCard = cardSurface instanceof Element && track.contains(cardSurface);
      if (isOverCard === isCardHoveredRef.current) return;

      isCardHoveredRef.current = isOverCard;
      if (isOverCard) pause();
      else resumeAfterIdle();
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      pause();
      const direction = event.key === 'ArrowLeft' ? -1 : 1;
      track.scrollLeft += direction * track.clientWidth * 0.8;
      resumeAfterIdle();
    };

    const handlePointerDown = (event: PointerEvent): void => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      if (!(event.target instanceof Element) || !event.target.closest(CARD_SURFACE_SELECTOR)) return;
      isDraggingRef.current = true;
      didDragRef.current = false;
      dragStartXRef.current = event.clientX;
      dragStartScrollRef.current = track.scrollLeft;
      pause();
      track.setPointerCapture(event.pointerId);
      track.dataset.dragging = 'true';
    };

    const handlePointerMove = (event: PointerEvent): void => {
      if (!isDraggingRef.current) return;
      const distance = event.clientX - dragStartXRef.current;
      if (Math.abs(distance) >= DRAG_THRESHOLD_PX) didDragRef.current = true;
      if (!didDragRef.current) return;
      event.preventDefault();
      track.scrollLeft = dragStartScrollRef.current - distance;
    };

    const finishDrag = (event: PointerEvent): void => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      delete track.dataset.dragging;
      if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
      if (didDragRef.current) {
        suppressClickUntilRef.current = performance.now() + DRAG_CLICK_SUPPRESSION_MS;
      }
      didDragRef.current = false;
      if (!isCardHoveredRef.current) resumeAfterIdle();
    };

    const preventNativeDrag = (event: DragEvent): void => {
      event.preventDefault();
    };

    window.addEventListener('pointermove', handleHoverPointerMove, { passive: true });
    track.addEventListener('keydown', handleKeyDown);
    track.addEventListener('pointerdown', handlePointerDown);
    track.addEventListener('pointermove', handlePointerMove);
    track.addEventListener('pointerup', finishDrag);
    track.addEventListener('pointercancel', finishDrag);
    track.addEventListener('dragstart', preventNativeDrag);
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      if (resumeTimer !== null) window.clearTimeout(resumeTimer);
      window.removeEventListener('pointermove', handleHoverPointerMove);
      track.removeEventListener('keydown', handleKeyDown);
      track.removeEventListener('pointerdown', handlePointerDown);
      track.removeEventListener('pointermove', handlePointerMove);
      track.removeEventListener('pointerup', finishDrag);
      track.removeEventListener('pointercancel', finishDrag);
      track.removeEventListener('dragstart', preventNativeDrag);
    };
  }, []);

  const shouldSuppressClick = useCallback(
    (): boolean => performance.now() < suppressClickUntilRef.current,
    [],
  );

  return { trackRef, handleScroll, shouldSuppressClick };
};

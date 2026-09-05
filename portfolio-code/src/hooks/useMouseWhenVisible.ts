import { useEffect, useState, type RefObject } from 'react';
import { clamp } from '../utils/math';

interface UseMouseWhenVisibleOptions {
  /** 0..1 portion of the element that must be visible to count as intersecting. */
  threshold?:  number;
  /** Margin around the root used by IntersectionObserver. */
  rootMargin?: string;
}

interface MouseWhenVisibleResult {
  /** True while the element intersects the viewport at the configured threshold. */
  isVisible: boolean;
  /**
   * Normalised scroll progress 0..1 — 0 when the element has just entered from
   * the bottom of the viewport, 1 when it is exiting from the top.
   */
  scrollProgress: number;
}

/** Computes how far the element has travelled through the viewport (0..1). */
const computeViewportProgress = (element: HTMLElement): number => {
  const rect          = element.getBoundingClientRect();
  const viewportH     = window.innerHeight;
  const elementHeight = rect.height;
  const scrollRange   = viewportH + elementHeight;
  const scrolled      = viewportH - rect.top;
  return clamp(scrolled / scrollRange, 0, 1);
};

export const useMouseWhenVisible = (
  elementRef: RefObject<HTMLElement | null>,
  options: UseMouseWhenVisibleOptions = {},
): MouseWhenVisibleResult => {
  const { threshold = 0.1, rootMargin = '0px' } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        setIsVisible(entry.isIntersecting);
      }
    }, { threshold, rootMargin });

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, threshold, rootMargin]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !isVisible) return;

    let rafId: number | null = null;
    let isScheduled = false;

    const recompute = (): void => {
      setScrollProgress(computeViewportProgress(element));
      isScheduled = false;
    };

    const handleScroll = (): void => {
      if (isScheduled) return;
      isScheduled = true;
      rafId = requestAnimationFrame(recompute);
    };

    recompute();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [elementRef, isVisible]);

  return { isVisible, scrollProgress };
};

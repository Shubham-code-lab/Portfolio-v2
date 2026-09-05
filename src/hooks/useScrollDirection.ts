import { useEffect, useRef, useState } from 'react';

interface UseScrollDirectionOptions {
  /** Pixels of scroll before the directional logic kicks in. */
  threshold?: number;
}

const DEFAULT_THRESHOLD_PX = 800;

/**
 * Reports whether the navbar should be visible based on scroll direction.
 * Listener is registered once. Earlier versions re-bound on every pixel of
 * scroll because `lastScrollY` lived in deps; we use refs to avoid that.
 */
export const useScrollDirection = (options: UseScrollDirectionOptions = {}) => {
  const thresholdRef    = useRef(options.threshold ?? DEFAULT_THRESHOLD_PX);
  const lastScrollYRef  = useRef(0);
  const [isVisible, setIsVisible] = useState(true);

  // Keep the threshold in a ref so we never re-bind the listener.
  thresholdRef.current = options.threshold ?? DEFAULT_THRESHOLD_PX;

  useEffect(() => {
    const handleScroll = (): void => {
      const currentScrollY = window.scrollY;
      const threshold      = thresholdRef.current;

      if (currentScrollY < threshold) {
        setIsVisible(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      const scrollingDown = currentScrollY > lastScrollYRef.current;
      setIsVisible(!scrollingDown);
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { isVisible };
};

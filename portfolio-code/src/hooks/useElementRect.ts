import { type RefObject, useLayoutEffect, useState } from 'react';

interface Rect {
  x:      number;
  y:      number;
  width:  number;
  height: number;
}

const ZERO_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };

/** rAF attempts when ref is null (e.g. node inside createPortal on first pass). */
const MAX_REF_ATTACH_RAF = 32;

/**
 * Tracks an element's viewport-relative rectangle. Re-measures on:
 *  - element size changes (ResizeObserver)
 *  - window resize
 *  - window scroll (so apex / vertices stay anchored if the navbar moves)
 *
 * If `ref.current` is null in the first layout pass, retries on subsequent
 * animation frames (portal children may not be attached in that same pass).
 * Without this, the effect can return early and never re-run: `[ref]` is stable
 * so the hook stays stuck on ZERO_RECT.
 */
export function useElementRect(ref: RefObject<Element | null>): Rect {
  const [rect, setRect] = useState<Rect>(ZERO_RECT);

  useLayoutEffect(() => {
    let cancelled = false;
    let rafId     = 0;
    let detach: (() => void) | null = null;

    const measure = (target: Element): void => {
      const next = target.getBoundingClientRect();
      setRect({ x: next.x, y: next.y, width: next.width, height: next.height });
    };

    const tryAttach = (attempt: number): void => {
      if (cancelled) return;
      const target = ref.current;
      if (target == null) {
        if (attempt < MAX_REF_ATTACH_RAF) {
          rafId = requestAnimationFrame(() => { tryAttach(attempt + 1); });
        }
        return;
      }

      measure(target);

      const ro = new ResizeObserver(() => {
        if (ref.current != null) measure(ref.current);
      });
      ro.observe(target);

      const onWin = (): void => {
        if (ref.current != null) measure(ref.current);
      };
      window.addEventListener('resize', onWin);
      window.addEventListener('scroll', onWin, { passive: true });

      detach = (): void => {
        ro.disconnect();
        window.removeEventListener('resize', onWin);
        window.removeEventListener('scroll', onWin);
      };
    };

    tryAttach(0);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      detach?.();
    };
  }, [ref]);

  return rect;
}

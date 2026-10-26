import { useEffect, useRef } from 'react';

interface NekoOptions {
  speed?: number;
  parent?: HTMLElement;
}

interface NekoInstance {
  sleep: () => void;
  wake: () => void;
  setTarget: (x: number, y: number) => void;
  destroy: () => void;
}

declare global {
  interface Window {
    Neko: new (options?: NekoOptions) => NekoInstance;
  }
}

const SCRIPT_URL    = `${import.meta.env.BASE_URL}vendor/neko/neko.js`;
const SCRIPT_MARKER = 'data-neko-script';

const loadNekoScript = (): Promise<void> => {
  if (window.Neko) return Promise.resolve();

  return new Promise(resolve => {
    const existing = document.querySelector(`script[${SCRIPT_MARKER}]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.dataset.nekoScript = 'true';
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
};

/** Boots the vanilla cat from `public/vendor/neko` once and tears it down on unmount. */
export const useNekoScript = (options: NekoOptions = {}): void => {
  const instanceRef = useRef<NekoInstance | null>(null);

  useEffect(() => {
    let cancelled = false;
    let animationFrame = 0;
    let inProjectIndex = false;
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const parent  = options.parent ?? document.body;
    const speed   = options.speed;

    const updateProjectIndexTarget = (): void => {
      animationFrame = 0;
      const instance = instanceRef.current;
      if (!instance) return;

      const hoveredElement = document.elementFromPoint(pointer.x, pointer.y);
      const section = hoveredElement?.closest<HTMLElement>('#project-index') ?? null;

      if (!section) {
        if (inProjectIndex) {
          inProjectIndex = false;
          instance.wake();
          instance.setTarget(pointer.x, pointer.y);
        }
        return;
      }

      if (!inProjectIndex) {
        inProjectIndex = true;
        instance.sleep();
      }

      instance.setTarget(
        Math.max(16, pointer.x - 48),
        Math.min(Math.max(16, pointer.y), window.innerHeight - 16),
      );
    };

    const scheduleProjectIndexTarget = (): void => {
      if (animationFrame !== 0) return;
      animationFrame = window.requestAnimationFrame(updateProjectIndexTarget);
    };

    const trackPointer = (event: PointerEvent): void => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      scheduleProjectIndexTarget();
    };

    window.addEventListener('pointermove', trackPointer, { passive: true });
    window.addEventListener('scroll', scheduleProjectIndexTarget, { passive: true });
    window.addEventListener('resize', scheduleProjectIndexTarget);

    loadNekoScript().then(() => {
      if (cancelled || !window.Neko) return;
      instanceRef.current = new window.Neko({ parent, speed });
      updateProjectIndexTarget();
    });

    return () => {
      cancelled = true;
      if (animationFrame !== 0) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('pointermove', trackPointer);
      window.removeEventListener('scroll', scheduleProjectIndexTarget);
      window.removeEventListener('resize', scheduleProjectIndexTarget);
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  // Options are intentionally not in deps — Neko is a singleton page actor
  // and re-instantiating on every prop change would cause flicker.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

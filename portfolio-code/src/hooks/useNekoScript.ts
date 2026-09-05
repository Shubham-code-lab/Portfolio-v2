import { useEffect, useRef } from 'react';

interface NekoOptions {
  speed?: number;
  parent?: HTMLElement;
}

interface NekoInstance {
  destroy: () => void;
}

declare global {
  interface Window {
    Neko: new (options?: NekoOptions) => NekoInstance;
  }
}

const SCRIPT_URL    = `${import.meta.env.BASE_URL}neko.js`;
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

/** Boots the vanilla `/public/neko.js` cat once and tears it down on unmount. */
export const useNekoScript = (options: NekoOptions = {}): void => {
  const instanceRef = useRef<NekoInstance | null>(null);

  useEffect(() => {
    let cancelled = false;
    const parent  = options.parent ?? document.body;
    const speed   = options.speed;

    loadNekoScript().then(() => {
      if (cancelled || !window.Neko) return;
      instanceRef.current = new window.Neko({ parent, speed });
    });

    return () => {
      cancelled = true;
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  // Options are intentionally not in deps — Neko is a singleton page actor
  // and re-instantiating on every prop change would cause flicker.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

import { useCallback, useEffect, useRef, useState } from 'react';

interface SpotlightConfig {
  /** Smoothing factor per frame for centre + radius (0..1). Higher = snappier. */
  damping: number;
  /** Spotlight radius (px) when the pointer is over typography. */
  radiusOverTypography: number;
  /** Spotlight radius (px) when outside typography. */
  radiusOutside: number;
  /** When true the spotlight only appears while hovering typography. */
  revealOnlyOnTypography: boolean;
}

interface SpotlightHandles {
  wrapRef: React.RefObject<HTMLDivElement | null>;
  revealRef: React.RefObject<HTMLDivElement | null>;
  overTypography: boolean;
  handleEnter: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleMove:  (event: React.MouseEvent<HTMLDivElement>) => void;
  handleLeave: () => void;
}

interface Point { x: number; y: number; }

/** Keep the lens alive while crossing the small visual gap between adjacent text lines. */
const TEXT_LINE_BRIDGE_PX = 120;

/**
 * Hook that drives the CursorReveal spotlight: clip-path follow loop, smoothed radius,
 * fixed-position follow dot and typography-aware enable/disable.
 *
 * All event payload (clientX/Y) is RAF-batched so we never run more than one
 * geometry calculation per frame even on a 240Hz mouse.
 */
export const useCursorSpotlight = (config: SpotlightConfig): SpotlightHandles => {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  const followRafRef  = useRef<number | null>(null);
  const moveRafRef    = useRef<number | null>(null);
  const hoverRef      = useRef(false);
  const typoHoverRef  = useRef(false);
  const targetRef     = useRef<Point>({ x: 0, y: 0 });
  const currentRef    = useRef<Point>({ x: 0, y: 0 });
  const radiusRef     = useRef(0);
  const pendingRef    = useRef<Point>({ x: 0, y: 0 });

  const [overTypography, setOverTypography] = useState(false);

  const targetRadius = useCallback((): number => {
    return typoHoverRef.current ? config.radiusOverTypography : config.radiusOutside;
  }, [config.radiusOverTypography, config.radiusOutside]);

  const localPosFromClient = useCallback((clientX: number, clientY: number): Point => {
    const layer = revealRef.current ?? wrapRef.current;
    if (!layer) return { x: 0, y: 0 };
    const rect = layer.getBoundingClientRect();
    return {
      x: Math.round(clientX - rect.left),
      y: Math.round(clientY - rect.top),
    };
  }, []);

  const flushPendingTarget = useCallback((): void => {
    moveRafRef.current = null;
    if (!hoverRef.current) return;
    const { x: cx, y: cy } = pendingRef.current;
    targetRef.current = localPosFromClient(cx, cy);
  }, [localPosFromClient]);

  const scheduleTarget = useCallback((clientX: number, clientY: number): void => {
    pendingRef.current = { x: clientX, y: clientY };
    if (moveRafRef.current === null) {
      moveRafRef.current = requestAnimationFrame(flushPendingTarget);
    }
  }, [flushPendingTarget]);

  const cancelPendingTarget = useCallback((): void => {
    if (moveRafRef.current === null) return;
    cancelAnimationFrame(moveRafRef.current);
    moveRafRef.current = null;
  }, []);

  const stopFollowLoop = useCallback((): void => {
    if (followRafRef.current === null) return;
    cancelAnimationFrame(followRafRef.current);
    followRafRef.current = null;
  }, []);

  const tickFollow = useCallback((): void => {
    const layer = revealRef.current;
    if (!layer || !hoverRef.current) {
      stopFollowLoop();
      return;
    }
    const damping = config.damping;
    const current = currentRef.current;
    const target  = targetRef.current;

    current.x += (target.x - current.x) * damping;
    current.y += (target.y - current.y) * damping;
    radiusRef.current += (targetRadius() - radiusRef.current) * damping;

    const clipRadius = Math.max(0, radiusRef.current);
    layer.style.transition = 'none';
    layer.style.clipPath   = `circle(${clipRadius}px at ${current.x}px ${current.y}px)`;

    followRafRef.current = requestAnimationFrame(tickFollow);
  }, [config.damping, stopFollowLoop, targetRadius]);

  const startFollowLoop = useCallback((): void => {
    stopFollowLoop();
    followRafRef.current = requestAnimationFrame(tickFollow);
  }, [stopFollowLoop, tickFollow]);

  const endSpotlight = useCallback((): void => {
    hoverRef.current = false;
    stopFollowLoop();
    cancelPendingTarget();

    const layer = revealRef.current;
    if (!layer) return;

    const { x, y } = currentRef.current;
    radiusRef.current = 0;
    layer.style.transition = 'none';
    layer.style.clipPath   = `circle(0px at ${x}px ${y}px)`;
  }, [cancelPendingTarget, stopFollowLoop]);

  const beginSpotlight = useCallback((event: React.MouseEvent<HTMLDivElement>): void => {
    hoverRef.current = true;

    const local = localPosFromClient(event.clientX, event.clientY);
    targetRef.current  = local;
    currentRef.current = { ...local };
    radiusRef.current  = 0;

    const layer = revealRef.current;
    if (!layer) return;
    layer.style.transition = 'none';
    layer.style.clipPath   = `circle(0px at ${local.x}px ${local.y}px)`;
    startFollowLoop();
  }, [localPosFromClient, startFollowLoop]);

  const updateTypographyHover = useCallback((event: React.MouseEvent<HTMLDivElement>): void => {
    const wrap = wrapRef.current;
    const textRects = wrap
      ? Array.from(wrap.querySelectorAll<HTMLElement>('[data-cursor-typography]'))
          .flatMap(element => Array.from(element.getClientRects()))
      : [];

    const isInsideRect = (rect: DOMRect): boolean => event.clientX >= rect.left
      && event.clientX <= rect.right
      && event.clientY >= rect.top
      && event.clientY <= rect.bottom;

    const isInsideBridge = textRects.some(upper => textRects.some(lower => {
      const verticalGap = lower.top - upper.bottom;
      if (verticalGap <= 0 || verticalGap > TEXT_LINE_BRIDGE_PX) return false;

      const bridgeLeft = Math.max(upper.left, lower.left);
      const bridgeRight = Math.min(upper.right, lower.right);
      return bridgeLeft < bridgeRight
        && event.clientX >= bridgeLeft
        && event.clientX <= bridgeRight
        && event.clientY >= upper.bottom
        && event.clientY <= lower.top;
    }));

    const isOver = textRects.some(isInsideRect) || isInsideBridge;
    if (typoHoverRef.current === isOver) return;
    typoHoverRef.current = isOver;
    setOverTypography(isOver);
  }, []);

  const handleEnter = useCallback((event: React.MouseEvent<HTMLDivElement>): void => {
    updateTypographyHover(event);

    const gateOk = !config.revealOnlyOnTypography || typoHoverRef.current;
    if (!gateOk) return;
    beginSpotlight(event);
  }, [beginSpotlight, config.revealOnlyOnTypography, updateTypographyHover]);

  const handleMove = useCallback((event: React.MouseEvent<HTMLDivElement>): void => {
    updateTypographyHover(event);

    if (config.revealOnlyOnTypography) {
      if (!typoHoverRef.current) {
        if (hoverRef.current) endSpotlight();
        return;
      }
      if (!hoverRef.current) {
        beginSpotlight(event);
        return;
      }
    }

    if (!hoverRef.current) return;
    scheduleTarget(event.clientX, event.clientY);
  }, [
    beginSpotlight,
    config.revealOnlyOnTypography,
    endSpotlight,
    scheduleTarget,
    updateTypographyHover,
  ]);

  const handleLeave = useCallback((): void => {
    typoHoverRef.current = false;
    setOverTypography(false);
    endSpotlight();
  }, [endSpotlight]);

  useEffect(() => {
    return () => {
      stopFollowLoop();
      cancelPendingTarget();
    };
  }, [cancelPendingTarget, stopFollowLoop]);

  return {
    wrapRef,
    revealRef,
    overTypography,
    handleEnter,
    handleMove,
    handleLeave,
  };
};

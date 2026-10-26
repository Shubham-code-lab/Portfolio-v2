import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { homeFontFamily } from '../styles/theme';

type CursorKind = 'default' | 'move' | 'label' | 'preview' | 'empty';

interface CursorState {
  kind: CursorKind;
  text: string;
  image?: string;
}

const DEFAULT_STATE: CursorState = { kind: 'default', text: 'PORT.' };
const MOVE_STATE: CursorState = { kind: 'move', text: '[ move cursor for magic ]' };
const EMPTY_STATE: CursorState = { kind: 'empty', text: '' };
const CURSOR_MEDIA = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

const statesMatch = (left: CursorState, right: CursorState): boolean =>
  left.kind === right.kind && left.text === right.text && left.image === right.image;

const stateForElement = (element: Element | null): CursorState => {
  if (!element) return DEFAULT_STATE;

  if (element.closest('[data-cursor-typography], [data-cursor-state="empty"]')) {
    return EMPTY_STATE;
  }

  const previewTarget = element.closest<HTMLElement>('[data-cursor-preview]');
  if (previewTarget?.dataset.cursorPreview) {
    return { kind: 'preview', text: '', image: previewTarget.dataset.cursorPreview };
  }

  const contextualTarget = element.closest<HTMLElement>('[data-cursor-label]');
  const contextualLabel = contextualTarget?.dataset.cursorLabel;
  if (contextualLabel === '[ drag ]') return MOVE_STATE;
  if (contextualLabel) return { kind: 'label', text: contextualLabel };

  if (element.closest('[data-cursor-state="move"]')) return MOVE_STATE;
  if (element.closest('[aria-label^="Close" i]')) return { kind: 'label', text: '[ close ]' };

  return DEFAULT_STATE;
};

export default function ContextCursor() {
  const followerRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ x: -100, y: -100 });
  const followerPositionRef = useRef({ x: -100, y: -100 });
  const visibleRef = useRef(false);
  const stateRef = useRef<CursorState>(DEFAULT_STATE);
  const [cursorState, setCursorState] = useState<CursorState>(DEFAULT_STATE);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.matchMedia(CURSOR_MEDIA).matches) return undefined;

    let animationFrame = 0;

    const setCursorVisibility = (nextVisible: boolean): void => {
      if (visibleRef.current === nextVisible) return;
      visibleRef.current = nextVisible;
      setVisible(nextVisible);
    };

    const updateState = (): void => {
      const element = document.elementFromPoint(pointerRef.current.x, pointerRef.current.y);
      const nextState = stateForElement(element);
      if (statesMatch(stateRef.current, nextState)) return;
      stateRef.current = nextState;
      setCursorState(nextState);
    };

    const handlePointerMove = (event: PointerEvent): void => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
      if (!visibleRef.current) {
        followerPositionRef.current = { x: event.clientX, y: event.clientY };
      }
      setCursorVisibility(true);
    };

    const handlePointerOut = (event: PointerEvent): void => {
      if (event.relatedTarget === null) setCursorVisibility(false);
    };

    const handleWindowBlur = (): void => setCursorVisibility(false);

    const animate = (): void => {
      const { x, y } = pointerRef.current;
      // Only the label trails. The real custom pointer remains directly controlled by the mouse.
      followerPositionRef.current.x += (x - followerPositionRef.current.x) * 0.1;
      followerPositionRef.current.y += (y - followerPositionRef.current.y) * 0.1;
      const follower = followerRef.current;
      if (follower) {
        follower.style.transform = `translate3d(${followerPositionRef.current.x}px, ${followerPositionRef.current.y}px, 0) translate(22px, 18px)`;
      }

      updateState();
      animationFrame = window.requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerout', handlePointerOut);
    window.addEventListener('blur', handleWindowBlur);
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerout', handlePointerOut);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  const isPreview = cursorState.kind === 'preview';
  const showFollower = visible && cursorState.kind !== 'empty';

  return (
    <CursorFollower
      ref={followerRef}
      $visible={showFollower}
      $preview={isPreview}
      aria-hidden="true"
    >
      {isPreview ? <CursorImage src={cursorState.image} alt="" /> : cursorState.text}
    </CursorFollower>
  );
}

const CursorFollower = styled.div<{ $visible: boolean; $preview: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 4000;
  display: grid;
  place-items: center;
  width: ${({ $preview }) => ($preview ? '180px' : 'auto')};
  min-width: ${({ $preview }) => ($preview ? '0' : '48px')};
  height: ${({ $preview }) => ($preview ? '250px' : '36px')};
  padding-inline: ${({ $preview }) => ($preview ? '0' : '14px')};
  box-sizing: border-box;
  overflow: hidden;
  border-radius: ${({ $preview }) => ($preview ? '4px' : '999px')};
  background: #fff;
  color: #000;
  font-family: ${homeFontFamily};
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.025em;
  line-height: 1;
  white-space: nowrap;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  scale: ${({ $visible }) => ($visible ? 1 : 0.82)};
  transform-origin: top left;
  pointer-events: none;
  mix-blend-mode: ${({ $preview }) => ($preview ? 'normal' : 'difference')};
  transition:
    opacity 0.2s ease,
    scale 0.3s cubic-bezier(0.34, 1.36, 0.64, 1),
    width 0.4s cubic-bezier(0.34, 1.36, 0.64, 1),
    height 0.4s cubic-bezier(0.34, 1.36, 0.64, 1),
    border-radius 0.4s cubic-bezier(0.34, 1.36, 0.64, 1);
  will-change: transform;

  @media (hover: none), (pointer: coarse), (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const CursorImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

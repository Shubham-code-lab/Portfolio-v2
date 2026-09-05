import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { NAVBAR_HEIGHT, Z_INDEX } from '../../constants/layout';
import { useElementRect } from '../../hooks/useElementRect';
import { buttonReset } from '../../styles/mixins';
import { spacing } from '../../styles/theme';
import { mq } from '../../utils/mediaQueries';
import FlashlightIcon from '../svg/FlashlightIcon';
import MenuButton from './MenuButton';

interface MenuItem {
  label: string;
  href:  string;
}

const MENU_ITEMS: readonly MenuItem[] = [
  { label: 'About',    href: '/home#about'    },
  { label: 'Projects', href: '/home#projects' },
  { label: 'Contact',  href: '/home#contact'  },
];

const ESCAPE_KEY              = 'Escape';
const BUTTON_BASE_DELAY_MS    = 320;
const BUTTON_STAGGER_DELAY_MS = 90;

/** Horizontal padding (px) beyond the measured pills row on each side at the floor line. */
const BEAM_SIDE_INSET_PX = 50;
/** Extra clearance (px) so pill edges stay off the slanted beam sides. */
const ROW_EDGE_PAD_PX = 10;

/** Same footprint as before; `translateY(50%)` shifts it so half sits below the viewport. */
const FLOOR_HEIGHT = '5rem';

const MENU_ROW_LEFT = '20rem';

interface ViewportRect {
  x:      number;
  y:      number;
  width:  number;
  height: number;
}

/**
 * Bottom chord of the beam trapezoid: wide enough for `row ± BEAM_SIDE_INSET_PX`,
 * and wide enough that the full row height stays between the two slanted sides
 * at **viewport bottom** (`floorY === innerHeight`). Falls back if height is degenerate.
 */
function beamBottomX(
  row: ViewportRect,
  apexLeft: number,
  apexRight: number,
  apexBottomY: number,
  floorY: number,
): { left: number; right: number } {
  const simpleLeft = row.x - BEAM_SIDE_INSET_PX;
  const simpleRight = row.x + row.width + BEAM_SIDE_INSET_PX;

  if (floorY <= apexBottomY + 0.5) {
    return { left: simpleLeft, right: simpleRight };
  }

  const needLeft = row.x - ROW_EDGE_PAD_PX;
  const needRight = row.x + row.width + ROW_EDGE_PAD_PX;
  const rowTop = row.y;
  const rowBottom = row.y + row.height;
  const span = floorY - apexBottomY;

  const tAt = (y: number): number => {
    const t = (y - apexBottomY) / span;
    if (!Number.isFinite(t)) return 0.5;
    if (t <= 0) return 0.001;
    if (t >= 1) return 0.999;
    return t;
  };

  const tTop = tAt(rowTop);
  const tBot = tAt(rowBottom);

  const baseLeftFromSlopes = Math.min(
    apexLeft + (needLeft - apexLeft) / tTop,
    apexLeft + (needLeft - apexLeft) / tBot,
  );
  const baseRightFromSlopes = Math.max(
    apexRight + (needRight - apexRight) / tTop,
    apexRight + (needRight - apexRight) / tBot,
  );

  if (!Number.isFinite(baseLeftFromSlopes) || !Number.isFinite(baseRightFromSlopes)) {
    return { left: simpleLeft, right: simpleRight };
  }

  return {
    left: Math.min(simpleLeft, baseLeftFromSlopes),
    right: Math.max(simpleRight, baseRightFromSlopes),
  };
}

/** True if (x, y) lies inside the beam trapezoid (same shape as clip-path). */
function clickInsideBeam(
  clientX: number,
  clientY: number,
  apexLeft: number,
  apexRight: number,
  apexY: number,
  baseLeft: number,
  baseRight: number,
  bottomY: number,
): boolean {
  if (clientY < apexY || clientY > bottomY) return false;
  const span = bottomY - apexY;
  if (span <= 0.5) return false;
  const t = (clientY - apexY) / span;
  const xLeft = apexLeft + (baseLeft - apexLeft) * t;
  const xRight = apexRight + (baseRight - apexRight) * t;
  return clientX >= xLeft && clientX <= xRight;
}

interface FlashlightMenuProps {
  /** When the fixed navbar hides on scroll, the torch closes so it is not orphaned. */
  navbarVisible: boolean;
}

/**
 * Full-screen overlay: black trapezoid from the handle down to the **bottom of the
 * screen**, white floor pill on top, links inside the beam. Overlay handle aligns with
 * the bar handle.
 */
export default function FlashlightMenu({ navbarVisible }: FlashlightMenuProps) {
  const [open, setOpen] = useState(false);
  const [viewportW, setViewportW] = useState(1200);
  const [viewportH, setViewportH] = useState(800);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRef = useRef<HTMLButtonElement>(null);
  const overlayHandleRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  const handleRect = useElementRect(handleRef);
  const overlayHandleRect = useElementRect(overlayHandleRef);
  const itemsRect = useElementRect(itemsRef);

  const closeMenu = useCallback(() => setOpen(false), []);
  const toggleMenu = useCallback(() => setOpen(prev => !prev), []);

  const handleSelect = useCallback((href: string): void => {
    setOpen(false);
    navigate(href);
  }, [navigate]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === ESCAPE_KEY) setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!navbarVisible) setOpen(false);
  }, [navbarVisible]);

  useLayoutEffect(() => {
    const update = (): void => {
      setViewportW(window.innerWidth);
      setViewportH(window.innerHeight);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const stopPropagation = useCallback((event: React.MouseEvent): void => {
    event.stopPropagation();
  }, []);

  const hasItems = itemsRect.width > 0;
  const hasHandle = handleRect.width > 0;
  const hasOverlayHandle = !open || overlayHandleRect.width > 0;
  const ready = hasItems && hasHandle && hasOverlayHandle;

  const apex = open && overlayHandleRect.width > 0 ? overlayHandleRect : handleRect;
  const apexLeftX = apex.x;
  const apexRightX = apex.x + apex.width;
  const apexY = apex.y + apex.height;

  const beamBottomY = viewportH;

  let baseLeft = 0;
  let baseRight = Math.min(400, viewportW);
  if (ready) {
    const corners = beamBottomX(
      {
        x: itemsRect.x,
        y: itemsRect.y,
        width: itemsRect.width,
        height: itemsRect.height,
      },
      apexLeftX,
      apexRightX,
      apexY,
      beamBottomY,
    );
    baseLeft = corners.left;
    baseRight = corners.right;
  }

  baseLeft = Math.max(0, baseLeft);
  baseRight = Math.max(baseLeft, Math.min(baseRight, viewportW));

  const floorTrackLeft = baseLeft;
  const floorTrackWidth = baseRight - baseLeft;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (
      clickInsideBeam(
        event.clientX,
        event.clientY,
        apexLeftX,
        apexRightX,
        apexY,
        baseLeft,
        baseRight,
        viewportH,
      )
    ) {
      return;
    }
    closeMenu();
  };

  const overlay = (
    <Overlay $open={open} onClick={handleOverlayClick} aria-hidden={!open}>
      <Beam
        $open={open}
        $apexLeftX={apexLeftX}
        $apexRightX={apexRightX}
        $apexY={apexY}
        $baseLeftX={baseLeft}
        $baseRightX={baseRight}
      />

      <FloorTrack $trackLeft={floorTrackLeft} $trackWidth={floorTrackWidth}>
        <FloorFill $open={open} />
      </FloorTrack>

      <ItemsRow ref={itemsRef} $open={open} onClick={stopPropagation}>
        {MENU_ITEMS.map((item, index) => (
          <MenuButton
            key={item.href}
            label={item.label}
            visible={open}
            delayMs={BUTTON_BASE_DELAY_MS + index * BUTTON_STAGGER_DELAY_MS}
            onClick={() => handleSelect(item.href)}
          />
        ))}
      </ItemsRow>

      <OverlayHandle
        ref={overlayHandleRef}
        type="button"
        onClick={closeMenu}
        aria-label="Close menu"
        $open={open}
      >
        <FlashlightIcon />
      </OverlayHandle>
    </Overlay>
  );

  return (
    <>
      <NavHandle
        ref={handleRef}
        type="button"
        onClick={toggleMenu}
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        tabIndex={open ? -1 : 0}
        $lit={open}
        $concealed={open}
      >
        <FlashlightIcon />
      </NavHandle>

      {typeof document !== 'undefined' && createPortal(overlay, document.body)}
    </>
  );
}

const handleVisualBase = css`
  ${buttonReset};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width:  4.4rem;
  height: 4.4rem;
  border-radius: 12px;
  flex-shrink: 0;
  transition:
    background 0.3s ease,
    color      0.3s ease,
    box-shadow 0.3s ease,
    transform  0.18s ease;

  &:hover  { transform: translateY(-1px); }
  &:active { transform: scale(0.96);      }
`;

const litVisual = css`
  background: ${({ theme }) => theme.flashlight.handleLit};
  color:      ${({ theme }) => theme.flashlight.handleLitText};
  box-shadow:
    0 0 0 2px ${({ theme }) => theme.flashlight.handleGlow},
    0 6px 18px ${({ theme }) => theme.flashlight.handleGlow};
`;

interface NavHandleProps {
  $lit:       boolean;
  /** True while the menu is open: hide this copy so only the overlay handle shows (no double icon). */
  $concealed: boolean;
}

const NavHandle = styled.button<NavHandleProps>`
  ${handleVisualBase};
  position: relative;
  color:      ${({ theme }) => theme.onAccent};
  background: ${({ theme }) => theme.flashlight.handle};
  box-shadow: 0 4px 12px ${({ theme }) => theme.shadow};
  ${({ $lit }) => $lit && litVisual};

  ${({ $concealed }) =>
    $concealed &&
    css`
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    `}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.flashlight.handleLit};
    outline-offset: 3px;
  }
`;

const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: ${Z_INDEX.modal};
  pointer-events: ${({ $open }) => ($open ? 'all' : 'none')};
  background: transparent;
  overflow: ${({ $open }) => ($open ? 'hidden' : 'visible')};
`;

interface BeamProps {
  $open:       boolean;
  $apexLeftX:  number;
  $apexRightX: number;
  $apexY:      number;
  $baseLeftX:  number;
  $baseRightX: number;
}

const Beam = styled.div<BeamProps>`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: ${({ theme }) => theme.flashlight.beamColor};
  clip-path: ${({ $apexLeftX, $apexRightX, $apexY, $baseRightX, $baseLeftX }) =>
    `polygon(
      ${$apexLeftX}px ${$apexY}px,
      ${$apexRightX}px ${$apexY}px,
      ${$baseRightX}px 100%,
      ${$baseLeftX}px 100%
    )`};
  transform-origin: ${({ $apexLeftX, $apexRightX, $apexY }) =>
    `${($apexLeftX + $apexRightX) / 2}px ${$apexY}px`};
  transform: ${({ $open }) => ($open ? 'scale(1)' : 'scale(0)')};
  opacity:   ${({ $open }) => ($open ? 1 : 0)};
  transition:
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    opacity   0.3s ease;
`;

interface FloorTrackProps {
  $trackLeft:  number;
  $trackWidth: number;
}

const FloorTrack = styled.div<FloorTrackProps>`
  position: absolute;
  bottom: 0;
  left: ${({ $trackLeft }) => `${$trackLeft}px`};
  width: ${({ $trackWidth }) => `${$trackWidth}px`};
  height: 0;
  z-index: 1;
  pointer-events: none;
`;

interface FloorFillProps {
  $open: boolean;
}

const FloorFill = styled.div<FloorFillProps>`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: ${FLOOR_HEIGHT};
  background: ${({ theme }) => theme.flashlight.floor};
  border-radius: 50%;
  transform-origin: 50% 100%;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: ${({ $open }) =>
    $open ? 'translateY(50%) scaleX(1)' : 'translateY(50%) scaleX(0)'};
  transition:
    transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${({ $open }) => ($open ? '0.25s' : '0s')},
    opacity   0.3s  ease                          ${({ $open }) => ($open ? '0.25s' : '0s')};
`;

const ItemsRow = styled.div<{ $open: boolean }>`
  position: absolute;
  z-index: 2;
  bottom: 5vh;
  left: ${MENU_ROW_LEFT};
  display: inline-flex;
  gap: 1.4rem;
  align-items: center;
  flex-wrap: nowrap;
  pointer-events: ${({ $open }) => ($open ? 'all' : 'none')};

  ${mq.mobile} {
    bottom: 8vh;
    left: ${spacing.lg};
    gap: 0.8rem;
  }
`;

interface OverlayHandleProps {
  $open: boolean;
}

const OverlayHandle = styled.button<OverlayHandleProps>`
  ${handleVisualBase};
  ${litVisual};
  position: absolute;
  z-index: 3;
  top:   calc((${NAVBAR_HEIGHT}px - 4.4rem) / 2);
  right: ${spacing.lg};
  opacity:        ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'all' : 'none')};
  transition:
    background 0.3s ease,
    color      0.3s ease,
    box-shadow 0.3s ease,
    transform  0.18s ease,
    opacity    0.25s ease;

  ${mq.mobile} {
    right: ${spacing.sm};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.flashlight.handleLit};
    outline-offset: 3px;
  }
`;

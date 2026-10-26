import styled from 'styled-components';
import { HERO_FIRST_SECTION_HEIGHT, NAVBAR_HEIGHT } from '../constants/layout';
import { homeFontFamily } from '../styles/theme';

const MainBackground = styled.div`
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5rem;
  font-family: ${homeFontFamily};
  background-color: #111111;
  color: ${({ theme }) => theme.primary[500]};
  padding-top: ${NAVBAR_HEIGHT}px;
  /* Belt-and-braces: never let any internal element create horizontal scroll. */
  overflow-x: clip;

  /* Four large square matrix cells per viewport row. The outer frame stays
     detached from the browser edge by a deliberate 20px breathing space. */
  &::before {
    --matrix-line: rgba(255, 255, 255, 0.035);
    --matrix-cell: calc((100vw - 40px) / 4);
    content: '';
    position: absolute;
    top: calc(${NAVBAR_HEIGHT}px + ${HERO_FIRST_SECTION_HEIGHT} + 20px);
    right: 20px;
    bottom: 20px;
    left: 20px;
    z-index: 0;
    pointer-events: none;
    background-image:
      linear-gradient(
        90deg,
        transparent 0,
        transparent calc(25% - 0.5px),
        var(--matrix-line) calc(25% - 0.5px),
        var(--matrix-line) calc(25% + 0.5px),
        transparent calc(25% + 0.5px),
        transparent calc(50% - 0.5px),
        var(--matrix-line) calc(50% - 0.5px),
        var(--matrix-line) calc(50% + 0.5px),
        transparent calc(50% + 0.5px),
        transparent calc(75% - 0.5px),
        var(--matrix-line) calc(75% - 0.5px),
        var(--matrix-line) calc(75% + 0.5px),
        transparent calc(75% + 0.5px),
        transparent 100%
      ),
      repeating-linear-gradient(
        to bottom,
        transparent 0,
        transparent calc(var(--matrix-cell) - 1px),
        var(--matrix-line) calc(var(--matrix-cell) - 1px),
        var(--matrix-line) var(--matrix-cell)
      );
    background-size:
      100% 100%,
      100% var(--matrix-cell);
    background-position: 0 0;
    background-repeat: no-repeat, repeat-y;
    /* Ensure a repeated horizontal divider can never paint on the final edge. */
    -webkit-mask-image: linear-gradient(to bottom, #000 0 calc(100% - 1px), transparent 100%);
    mask-image: linear-gradient(to bottom, #000 0 calc(100% - 1px), transparent 100%);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E");
    background-size: 70px 70px;
    background-repeat: repeat;
    mix-blend-mode: soft-light;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

export default MainBackground;

import { lerp } from '../../utils/math';

export interface BrickRect {
  key: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface TrapezoidRow {
  yTop:    number;
  yBottom: number;
  xMinTop: number;
  xMaxTop: number;
  xMinBottom: number;
  xMaxBottom: number;
  prefix:  string;
}

const MORTAR  = 0.42;
const BRICK_W = 5.15;
const BRICK_H = 3.05;
/** Head band uses a slightly squatter brick so it reads as a different course. */
const HEAD_BAND_BRICK_H = BRICK_H * 0.92;

/**
 * Trapezoid (or rectangle when top edges == bottom edges) regions to fill with
 * running-bond bricks. Numbers are coordinates inside the 100 x 208 viewBox.
 */
const TRAPEZOIDS: readonly TrapezoidRow[] = [
  // Flat foot
  { yTop: 188.15, yBottom: 206.20, xMinTop: 11.20, xMaxTop: 88.80, xMinBottom: 11.20, xMaxBottom: 88.80, prefix: 'ft' },
  // Lower flare (narrow at top, wide at bottom)
  { yTop: 162.20, yBottom: 187.85, xMinTop: 38.40, xMaxTop: 61.60, xMinBottom: 10.50, xMaxBottom: 89.50, prefix: 'tr' },
  // Shaft
  { yTop:  76.20, yBottom: 161.60, xMinTop: 38.45, xMaxTop: 61.55, xMinBottom: 38.45, xMaxBottom: 61.55, prefix: 'sh' },
  // Upper flare (wide at top, narrow at bottom)
  { yTop:  48.10, yBottom:  74.85, xMinTop: 24.35, xMaxTop: 75.65, xMinBottom: 38.35, xMaxBottom: 61.65, prefix: 'up' },
];

/** Head band sits below merlons; clipped to the tower silhouette. */
const HEAD_BAND = {
  yTop: 30.20, yBottom: 47.75, xMin: 24.45, xMax: 75.55, prefix: 'hd',
} as const;

const pushRunningBondRows = (
  out: BrickRect[],
  region: TrapezoidRow,
  brickH: number,
): void => {
  const rowStep = brickH + MORTAR;
  let rowIndex = 0;

  for (let yCursor = region.yTop; yCursor + brickH + MORTAR * 0.5 <= region.yBottom + 0.001; yCursor += rowStep) {
    const yMidpoint = yCursor + MORTAR * 0.5 + brickH * 0.5;
    const verticalT = (yMidpoint - region.yTop) / (region.yBottom - region.yTop);

    const xMin = lerp(region.xMinTop, region.xMinBottom, verticalT);
    const xMax = lerp(region.xMaxTop, region.xMaxBottom, verticalT);
    const yPos = yCursor + MORTAR * 0.5;
    const stagger = (rowIndex % 2) * ((BRICK_W + MORTAR) * 0.5);

    let columnIndex = 0;
    for (let xCursor = xMin - stagger; xCursor < xMax + BRICK_W; xCursor += BRICK_W + MORTAR) {
      const xPos = xCursor + MORTAR * 0.5;
      if (xPos >= xMax - 0.05) break;

      const xEnd  = Math.min(xPos + BRICK_W, xMax - MORTAR * 0.5);
      const width = xEnd - xPos;
      if (width < 0.55) continue;

      out.push({
        key: `${region.prefix}-r${rowIndex}-c${columnIndex}`,
        x: xPos,
        y: yPos,
        w: width,
        h: brickH,
      });
      columnIndex += 1;
    }
    rowIndex += 1;
  }
};

/** Build the (running bond) brick rectangles that fill the tower silhouette. */
export const buildTowerBricks = (): BrickRect[] => {
  const bricks: BrickRect[] = [];
  for (const region of TRAPEZOIDS) {
    pushRunningBondRows(bricks, region, BRICK_H);
  }
  pushRunningBondRows(bricks, {
    yTop: HEAD_BAND.yTop,
    yBottom: HEAD_BAND.yBottom,
    xMinTop: HEAD_BAND.xMin,
    xMaxTop: HEAD_BAND.xMax,
    xMinBottom: HEAD_BAND.xMin,
    xMaxBottom: HEAD_BAND.xMax,
    prefix: HEAD_BAND.prefix,
  }, HEAD_BAND_BRICK_H);
  return bricks;
};

/**
 * Castle tower outline (stroke only): wide base → flared trapezoid → shaft →
 * flared crown → merlons (4 teeth, 3 gaps). All straight segments — low-poly.
 * viewBox 0 0 100 208.
 */
export const CASTLE_TOWER_PATH =
  'M10 208 L90 208 L90 188 L62 162 L62 75 L76 48 L76 28' +
  ' L76 8 L68 8 L68 28 L65 28 L65 8 L57 8 L57 28 L54 28 L54 8 L46 8 L46 28 L43 28 L43 8' +
  ' L35 8 L35 28 L32 28 L32 8 L24 8 L24 28' +
  ' L24 48 L38 75 L38 162 L10 188 Z';

export const BRICK_CLIP_ID = 'heroTowerBrickClip';

/**
 * neko.js — A cursor-chasing cat for the web
 *
 * The cat is drawn using a single sprite sheet: neko-sprites.gif
 * The sheet is a grid of 32×32 pixel frames arranged in 8 columns × 4 rows.
 * To show a specific animation frame, we shift the background-position of a div
 * so that only the desired 32×32 cell is visible.
 *
 * Each entry in ANIMATION_FRAMES is [columnOffset, rowOffset].
 * These are negative because background-position moves the image leftward/upward.
 * The actual pixel value = offset × spriteSize (e.g. -3 × 32 = -96px).
 *
 * Usage (plain HTML):
 *   <script src="/neko.js"></script>
 *   <script>
 *     document.addEventListener('DOMContentLoaded', () => {
 *       const cat = new Neko();
 *     });
 *   </script>
 */

// ---------------------------------------------------------------------------
// Sprite sheet path
// The file neko-sprites.gif lives in /public and is served at this URL.
// ---------------------------------------------------------------------------
const nekoScriptEl = document.currentScript instanceof HTMLScriptElement
  ? document.currentScript
  : document.querySelector('script[data-neko-script]');
const SPRITE_SHEET_URL = nekoScriptEl instanceof HTMLScriptElement
  ? new URL('neko-sprites.gif', nekoScriptEl.src).href
  : 'neko-sprites.gif';

// ---------------------------------------------------------------------------
// Sprite sheet frame definitions
// ---------------------------------------------------------------------------
// Each key is an animation name.
// Each value is an array of [columnOffset, rowOffset] pairs.
// Multiple pairs = multiple frames that cycle during that animation.

const ANIMATION_FRAMES = {
  idle:         [[-3, -3]],
  alert:        [[-7, -3]],

  // Scratching animations
  scratchSelf:  [[-5, 0], [-6, 0], [-7, 0]],
  scratchWallN: [[ 0, 0], [ 0, -1]],
  scratchWallS: [[-7, -1], [-6, -2]],
  scratchWallE: [[-2, -2], [-2, -3]],
  scratchWallW: [[-4, 0],  [-4, -1]],

  // Tired → sleeping sequence
  tired:    [[-3, -2]],
  sleeping: [[-2, 0], [-2, -1]],

  // Walking in 8 directions (N=up, S=down, E=right, W=left)
  N:  [[-1, -2], [-1, -3]],
  NE: [[ 0, -2], [ 0, -3]],
  E:  [[-3,  0], [-3, -1]],
  SE: [[-5, -1], [-5, -2]],
  S:  [[-6, -3], [-7, -2]],
  SW: [[-5, -3], [-6, -1]],
  W:  [[-4, -2], [-4, -3]],
  NW: [[-1,  0], [-1, -1]],
};

// ---------------------------------------------------------------------------
// Neko class
// ---------------------------------------------------------------------------

class Neko {
  /**
   * Creates a new Neko (cat) that chases the mouse cursor.
   *
   * @param {object} options
   * @param {number} [options.speed=10]            - How fast the cat moves (10–20)
   * @param {HTMLElement} [options.parent=body]    - Container element
   * @param {{x:number,y:number}} [options.origin] - Starting position
   */
  constructor(options = {}) {
    // --- Configuration ---
    this.spriteSize = 32;
    this.movementSpeed = Math.min(Math.max(options.speed ?? 10, 10), 20);
    this.parentElement = options.parent ?? document.body;
    this.startPosition = options.origin ?? { x: 0, y: 0 };

    // How close to the cursor before the cat stops chasing
    this.stopDistance = 25;

    // --- Cat position on screen ---
    this.catPositionX = this.startPosition.x || this.spriteSize / 2;
    this.catPositionY = this.startPosition.y || this.spriteSize / 2;

    // --- Cursor position (updated on mousemove) ---
    this.cursorPositionX = this.catPositionX;
    this.cursorPositionY = this.catPositionY;

    // --- Animation state ---
    this.totalFrameCount = 0;         // increments every tick, used to cycle walk frames
    this.idleTickCount = 0;           // how many ticks the cat has been idle
    this.currentIdleAnimation = null; // e.g. 'sleeping', 'scratchSelf'
    this.idleAnimationFrameIndex = 0; // which frame of the idle animation we're on

    // --- Lifecycle ---
    this.isAwake = true;
    this.animationIntervalId = null;

    // AbortControllers let us cleanly remove event listeners on destroy/sleep
    this.mouseMoveAbortController = new AbortController();
    this.touchMoveAbortController = new AbortController();

    // Respect the user's OS-level "reduce motion" accessibility setting
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Prevent duplicate cats — only one allowed at a time
    if (document.querySelector('[data-neko-active]')) return;

    this._buildCatElement();
    this._startListeningToInput();
    this._startAnimationLoop();
  }

  // -------------------------------------------------------------------------
  // Setup
  // -------------------------------------------------------------------------

  /** Creates the cat <div> element and appends it to the parent */
  _buildCatElement() {
    this.catElement = document.createElement('div');

    // Mark it so we can detect duplicates
    this.catElement.dataset.nekoActive = 'true';

    this.catElement.style.cssText = `
      position: fixed;
      width: ${this.spriteSize}px;
      height: ${this.spriteSize}px;
      left: ${this.catPositionX - this.spriteSize / 2}px;
      top: ${this.catPositionY - this.spriteSize / 2}px;
      background-image: url(${SPRITE_SHEET_URL});
      background-size: ${this.spriteSize * 8}px ${this.spriteSize * 4}px;
      image-rendering: pixelated;
      pointer-events: none;
      user-select: none;
      z-index: 9998;
    `;

    this.parentElement.appendChild(this.catElement);
  }

  /** Attaches mousemove and touchmove listeners to track the cursor */
  _startListeningToInput() {
    this.parentElement.addEventListener(
      'mousemove',
      (event) => {
        this.cursorPositionX = event.clientX;
        this.cursorPositionY = event.clientY;
      },
      { signal: this.mouseMoveAbortController.signal }
    );

    this.parentElement.addEventListener(
      'touchmove',
      (event) => {
        this.cursorPositionX = event.touches[0].clientX;
        this.cursorPositionY = event.touches[0].clientY;
      },
      { signal: this.touchMoveAbortController.signal }
    );
  }

  /** Starts the animation loop — runs _tick() every 60ms (~16fps) */
  _startAnimationLoop() {
    this.animationIntervalId = setInterval(() => this._tick(), 60);
  }

  // -------------------------------------------------------------------------
  // Sprite rendering
  // -------------------------------------------------------------------------

  /**
   * Shifts the background-position to show a specific animation frame.
   *
   * The sprite sheet is 8 columns × 4 rows of 32×32 frames.
   * background-position moves the image so the desired cell lines up with the div.
   *
   * @param {string} animationName - Key in ANIMATION_FRAMES
   * @param {number} frameIndex    - Which frame in the animation to show
   */
  _showSprite(animationName, frameIndex) {
    const frames = ANIMATION_FRAMES[animationName];
    const [columnOffset, rowOffset] = frames[frameIndex % frames.length];
    const xPixels = columnOffset * this.spriteSize;
    const yPixels = rowOffset * this.spriteSize;
    this.catElement.style.backgroundPosition = `${xPixels}px ${yPixels}px`;
  }

  // -------------------------------------------------------------------------
  // Idle behaviour
  // -------------------------------------------------------------------------

  /** Resets idle animation so the cat goes back to sitting still */
  _resetIdleAnimation() {
    this.currentIdleAnimation = null;
    this.idleAnimationFrameIndex = 0;
  }

  /**
   * Called every tick when the cat is close enough to the cursor to stop.
   * After sitting still briefly, it may randomly start sleeping or scratching.
   */
  _playIdleAnimation() {
    this.idleTickCount += 1;

    // After 5 idle ticks, randomly pick an idle animation (1% chance per tick)
    const shouldPickNewIdleAnimation =
      this.idleTickCount > 5 &&
      Math.floor(Math.random() * 100) === 0 &&
      this.currentIdleAnimation === null;

    if (shouldPickNewIdleAnimation) {
      const availableAnimations = ['sleeping', 'scratchSelf'];

      // Add wall-scratch options when close to screen edges
      if (this.catPositionX < 32)                          availableAnimations.push('scratchWallW');
      if (this.catPositionY < 32)                          availableAnimations.push('scratchWallN');
      if (this.catPositionX > window.innerWidth  - 32)     availableAnimations.push('scratchWallE');
      if (this.catPositionY > window.innerHeight - 32)     availableAnimations.push('scratchWallS');

      this.currentIdleAnimation =
        availableAnimations[Math.floor(Math.random() * availableAnimations.length)];
    }

    switch (this.currentIdleAnimation) {
      case 'sleeping':
        // First 8 frames: show "tired" pose, then cycle the sleeping frames
        if (this.idleAnimationFrameIndex < 8) {
          this._showSprite('tired', 0);
        } else {
          this._showSprite('sleeping', Math.floor(this.idleAnimationFrameIndex / 4));
          // After a long sleep, wake up and go back to sitting
          if (this.idleAnimationFrameIndex > 192) this._resetIdleAnimation();
        }
        break;

      case 'scratchWallN':
      case 'scratchWallS':
      case 'scratchWallE':
      case 'scratchWallW':
      case 'scratchSelf':
        this._showSprite(this.currentIdleAnimation, this.idleAnimationFrameIndex);
        if (this.idleAnimationFrameIndex > 9) this._resetIdleAnimation();
        break;

      default:
        // Default: just sit still
        this._showSprite('idle', 0);
        return; // Don't increment frame index for the static idle pose
    }

    this.idleAnimationFrameIndex += 1;
  }

  // -------------------------------------------------------------------------
  // Main animation tick
  // -------------------------------------------------------------------------

  /**
   * Called every 60ms.
   * Calculates distance to the cursor, moves the cat toward it,
   * and picks the correct sprite direction based on movement.
   */
  _tick() {
    this.totalFrameCount += 1;

    // Vector from cat to cursor
    const deltaX = this.catPositionX - this.cursorPositionX;
    const deltaY = this.catPositionY - this.cursorPositionY;
    const distanceToCursor = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    // --- Close enough to cursor: stop and play idle animation ---
    if (distanceToCursor < this.movementSpeed || distanceToCursor < this.stopDistance) {
      this._playIdleAnimation();
      return;
    }

    // --- Cat is moving: reset idle state ---
    this.currentIdleAnimation = null;
    this.idleAnimationFrameIndex = 0;

    // Brief "alert" pose when waking from idle (idleTickCount counts down)
    if (this.idleTickCount > 1) {
      this._showSprite('alert', 0);
      this.idleTickCount = Math.min(this.idleTickCount, 7) - 1;
      return;
    }

    this.idleTickCount = 0;

    // --- Determine walking direction from the movement vector ---
    // Thresholds of ±0.5 on the normalised vector give us 8 directions
    let walkDirection = '';
    if (deltaY / distanceToCursor >  0.5) walkDirection += 'N'; // cursor is above
    if (deltaY / distanceToCursor < -0.5) walkDirection += 'S'; // cursor is below
    if (deltaX / distanceToCursor >  0.5) walkDirection += 'W'; // cursor is to the left
    if (deltaX / distanceToCursor < -0.5) walkDirection += 'E'; // cursor is to the right

    this._showSprite(walkDirection, this.totalFrameCount);

    // --- Move the cat toward the cursor ---
    this.catPositionX -= (deltaX / distanceToCursor) * this.movementSpeed;
    this.catPositionY -= (deltaY / distanceToCursor) * this.movementSpeed;

    // Clamp to stay within the viewport
    this.catPositionX = Math.min(
      Math.max(this.spriteSize / 2, this.catPositionX),
      window.innerWidth - this.spriteSize / 2
    );
    this.catPositionY = Math.min(
      Math.max(this.spriteSize / 2, this.catPositionY),
      window.innerHeight - this.spriteSize / 2
    );

    // Update the element's position on screen
    this.catElement.style.left = `${this.catPositionX - this.spriteSize / 2}px`;
    this.catElement.style.top  = `${this.catPositionY - this.spriteSize / 2}px`;
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /** Stops the cat from chasing the cursor (it stays where it is) */
  sleep() {
    if (!this.isAwake) return;
    this.mouseMoveAbortController.abort();
    this.touchMoveAbortController.abort();
    this.isAwake = false;
  }

  /** Resumes chasing the cursor after sleep() was called */
  wake() {
    if (this.isAwake) return;
    this.mouseMoveAbortController = new AbortController();
    this.touchMoveAbortController = new AbortController();
    this._startListeningToInput();
    this.isAwake = true;
  }

  /** Removes the cat from the page entirely and cleans up all resources */
  destroy() {
    clearInterval(this.animationIntervalId);
    this.mouseMoveAbortController.abort();
    this.touchMoveAbortController.abort();
    this.catElement?.remove();
  }
}

// Make Neko available as a browser global so it can be used from React
// or any plain HTML page without a bundler.
window.Neko = Neko;

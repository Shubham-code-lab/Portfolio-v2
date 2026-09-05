/**
 * Flashlight + hamburger icon.
 *
 * Three horizontal lines on top read as the universal hamburger (≡) — and
 * double as the grip lines on a flashlight body. Below them, a downward-
 * pointing trapezoid is the lens cap, so the icon's *bottom edge* is exactly
 * where the beam emerges. The handle button positions the beam apex at this
 * same bottom edge → icon and beam visually merge into one continuous shape.
 */
export default function FlashlightIcon() {
  return (
    <svg
      width="20"
      height="22"
      viewBox="0 0 22 24"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {/* Hamburger lines (= flashlight body grip) */}
      <path d="M5 4 L17 4"   stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 9 L17 9"   stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 14 L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

      {/* Lens cap (the bulb) — trapezoid widening downward */}
      <path d="M7 17 L15 17 L19 23 L3 23 Z" fill="currentColor" />
    </svg>
  );
}

const CLOUD_PATH =
  'M28 38c-7 0-13-4-13-11 0-5 3-9 8-11-1-7 5-13 12-13 4 0 8 2 10 5 2-2 6-3 10-3' +
  ' 8 0 15 6 15 14 0 7-6 13-14 13H28z';

export default function CloudShape() {
  return (
    <svg viewBox="0 4 100 56" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <path d={CLOUD_PATH} fill="var(--cloud-fill)" stroke="none" opacity="0.95" />
      <path
        d={CLOUD_PATH}
        fill="none"
        stroke="var(--cloud-stroke)"
        strokeWidth="2.1"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

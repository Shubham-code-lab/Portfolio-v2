interface Props {
  direction: 'left' | 'right';
}

const PATH_LEFT  = 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z';
const PATH_RIGHT = 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z';

export default function ChevronIcon({ direction }: Props) {
  const path = direction === 'left' ? PATH_LEFT : PATH_RIGHT;
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d={path} />
    </svg>
  );
}

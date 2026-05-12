export function WheelPointer(): JSX.Element {
  return (
    <svg
      viewBox="0 0 40 40"
      className="absolute left-1/2 -translate-x-1/2 -top-2 w-10 h-10 pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <filter id="pointer-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polygon
        points="20,38 8,8 32,8"
        fill="#FFD60A"
        stroke="#0a0a14"
        strokeWidth="2"
        filter="url(#pointer-glow)"
      />
      <circle cx="20" cy="8" r="4" fill="#FFD60A" stroke="#0a0a14" strokeWidth="2" />
    </svg>
  );
}

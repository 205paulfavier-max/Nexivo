import type { HiddenResource } from '@/types';

interface Props {
  readonly cx: number;
  readonly cy: number;
  readonly resource: HiddenResource;
  readonly revealed: boolean;
  readonly onReveal: () => void;
}

export function HiddenResourceMarker({ cx, cy, resource, revealed, onReveal }: Props): JSX.Element {
  if (revealed) {
    const fill = resource.kind === 'malus' ? '#FF1744' : '#FFD60A';
    return (
      <g aria-label={`${resource.label} révélé`}>
        <circle cx={cx} cy={cy} r={20} fill={fill} opacity={0.9} stroke="#000" strokeWidth={2} />
        <text x={cx} y={cy + 6} textAnchor="middle" fontSize={20}>
          {resource.icon}
        </text>
      </g>
    );
  }
  return (
    <g
      style={{ cursor: 'pointer' }}
      onClick={onReveal}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onReveal();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Ressource cachée — clique pour révéler"
    >
      <circle
        cx={cx}
        cy={cy}
        r={14}
        fill="rgba(0,0,0,0.6)"
        stroke="rgba(255,214,10,0.6)"
        strokeWidth={1.5}
        strokeDasharray="3 2"
      />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fill="rgba(255,214,10,0.85)"
        fontFamily="Bebas Neue"
        fontSize={18}
        fontWeight={700}
      >
        ?
      </text>
    </g>
  );
}

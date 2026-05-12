import { useMemo } from 'react';
import type { Wheel as WheelType } from '@/types';
import { useCountryStore } from '@/store/countryStore';
import { mulberry32 } from '@/engine/rng';
import { shuffleIndices } from '@/engine/shuffle';
import { hashSeed } from '@/engine/rng';
import { getTextColor, pickSegmentColor } from '@/data/colors';
import { formatLabel } from '@/utils/format';
import { useWheelAnimation, liveVisualPos } from './useWheelAnimation';
import { WheelPointer } from './WheelPointer';

interface WheelProps {
  readonly wheel: WheelType;
}

const SIZE = 400;
const CENTER = SIZE / 2;
const OUTER_RADIUS = 190;
const CENTER_HOLE_R = 38;
const TEXT_START_R = OUTER_RADIUS - 14;
const TEXT_END_R = CENTER_HOLE_R + 8;

function describeSlice(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  // Convert to SVG coordinates (angles measured CW from north).
  const toXY = (deg: number): [number, number] => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const [x1, y1] = toXY(startAngle);
  const [x2, y2] = toXY(endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
}

/**
 * The Spin-the-Wheel SVG. Subscribes to the store for the current pending
 * spin and renders a rotating group with radial text and the fixed pointer.
 *
 * Segment placement is shuffled per wheel via a deterministic seed (wheel id)
 * so the visual layout stays stable across rerenders during a single session.
 */
export function Wheel({ wheel }: WheelProps): JSX.Element {
  const pendingSpin = useCountryStore((s) => s.pendingSpin);
  const commitSpin = useCountryStore((s) => s.commitSpin);

  const N = wheel.segments.length;
  const anglePerSeg = 360 / N;

  // Stable shuffled display order per wheel id, so the layout doesn't reshuffle on every render.
  const displayOrder = useMemo(
    () => shuffleIndices(N, mulberry32(hashSeed(`wheel-${wheel.id}`))),
    [wheel.id, N],
  );

  // Map the engine's chosen index → its visual position so the wheel can target it.
  const targetVisualPos = useMemo(() => {
    if (!pendingSpin) return 0;
    const idx = displayOrder.indexOf(pendingSpin.targetIndex);
    return idx >= 0 ? idx : 0;
  }, [pendingSpin, displayOrder]);

  const target = pendingSpin
    ? {
        targetVisualPos,
        segmentCount: N,
        durationMs: pendingSpin.durationMs,
        nonce: pendingSpin.nonce,
      }
    : null;

  const { rotation, liveAngle, isAnimating, ref } = useWheelAnimation(target, commitSpin);

  const liveSegmentValue = useMemo(() => {
    const visualPos = liveVisualPos(liveAngle, N);
    const segIndex = displayOrder[visualPos] ?? 0;
    return wheel.segments[segIndex];
  }, [liveAngle, N, displayOrder, wheel.segments]);

  const showLabels = N <= 100;
  const fontSize = useMemo(() => {
    if (N <= 12) return 14;
    if (N <= 20) return 12;
    if (N <= 40) return 9;
    if (N <= 60) return 7;
    return 5;
  }, [N]);

  return (
    <div className="relative inline-block w-full max-w-[520px] mx-auto">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full h-auto select-none"
        role="img"
        aria-label={`Roue ${wheel.label}`}
      >
        <g
          ref={ref}
          style={{
            transformOrigin: `${CENTER}px ${CENTER}px`,
            transform: `rotate(${rotation}deg)`,
            transition: target ? `transform ${target.durationMs}ms cubic-bezier(0.17, 0.67, 0.21, 0.99)` : undefined,
          }}
        >
          {displayOrder.map((segIndex, visualPos) => {
            const startAngle = visualPos * anglePerSeg;
            const endAngle = (visualPos + 1) * anglePerSeg;
            const midAngle = (startAngle + endAngle) / 2;
            const fill = pickSegmentColor(visualPos);
            const textFill = getTextColor(fill);
            const seg = wheel.segments[segIndex];
            const labelText = seg === undefined ? '' : formatLabel(seg, 18);
            const midR = (TEXT_START_R + TEXT_END_R) / 2;

            return (
              <g key={`${wheel.id}-${visualPos}`}>
                <path
                  d={describeSlice(CENTER, CENTER, OUTER_RADIUS, startAngle, endAngle)}
                  fill={fill}
                  stroke="#0a0a14"
                  strokeWidth={N <= 30 ? 2.5 : 1.5}
                  strokeLinejoin="round"
                />
                {showLabels && (
                  <g
                    transform={`rotate(${midAngle - 90} ${CENTER} ${CENTER}) translate(${CENTER + midR} ${CENTER})`}
                  >
                    <text
                      transform="rotate(180)"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontFamily="JetBrains Mono, monospace"
                      fontSize={fontSize}
                      fontWeight={700}
                      fill={textFill}
                      stroke={textFill === '#FFFFFF' ? '#000000' : '#FFFFFF'}
                      strokeWidth={0.4}
                      paintOrder="stroke"
                    >
                      {labelText}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
        {/* Center hole */}
        <circle cx={CENTER} cy={CENTER} r={CENTER_HOLE_R} fill="#fff" stroke="#0a0a14" strokeWidth={3} />
        <text
          x={CENTER}
          y={CENTER + 5}
          textAnchor="middle"
          fontFamily="Bebas Neue, sans-serif"
          fontSize={16}
          fill="#0a0a14"
        >
          SPIN
        </text>
      </svg>
      <WheelPointer />
      {isAnimating && liveSegmentValue !== undefined && (
        <div
          className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 mt-10 rounded text-xs font-mono font-bold bg-bg/80 text-yellow border border-yellow"
          aria-live="polite"
        >
          {formatLabel(liveSegmentValue, 24)}
        </div>
      )}
    </div>
  );
}

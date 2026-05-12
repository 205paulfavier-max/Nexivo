import { useEffect, useRef, useState } from 'react';

export interface SpinTarget {
  /** Target visual position (index in the shuffled display order). */
  readonly targetVisualPos: number;
  /** Total number of segments. */
  readonly segmentCount: number;
  /** Animation duration in ms. */
  readonly durationMs: number;
  /** Counter — every increment kicks off a new spin. */
  readonly nonce: number;
}

const FULL_ROTATIONS = 6;

/**
 * Compute the next absolute rotation (degrees, cumulative) so that the
 * `targetVisualPos` segment lands centred under the pointer at 12 o'clock,
 * after `FULL_ROTATIONS` extra full turns.
 */
export function nextRotation(currentRotation: number, target: SpinTarget): number {
  const anglePerSeg = 360 / target.segmentCount;
  const segmentCenter = (target.targetVisualPos + 0.5) * anglePerSeg;
  const desiredFinalAngle = (((360 - segmentCenter) % 360) + 360) % 360;
  const currentMod = ((currentRotation % 360) + 360) % 360;
  const deltaToTarget = (((desiredFinalAngle - currentMod) % 360) + 360) % 360;
  return currentRotation + deltaToTarget + FULL_ROTATIONS * 360;
}

/**
 * Convert a wheel rotation in degrees to the visual position index currently
 * under the pointer at the top (12 o'clock).
 *
 * The wheel rotates clockwise, so a positive rotation moves the segment at
 * visual position 0 away from the top and brings the previous segment in.
 */
export function liveVisualPos(rotation: number, segmentCount: number): number {
  const anglePerSeg = 360 / segmentCount;
  const normalized = ((rotation % 360) + 360) % 360;
  const raw = (segmentCount - normalized / anglePerSeg) % segmentCount;
  return Math.floor(((raw % segmentCount) + segmentCount) % segmentCount);
}

/** Decode the rotation angle (degrees) from a CSS `matrix(a,b,c,d,e,f)` string. */
function decodeRotation(transformValue: string): number {
  if (!transformValue || transformValue === 'none') return 0;
  const m = transformValue.match(/matrix\(([^)]+)\)/);
  if (!m) return 0;
  const parts = m[1]!.split(',').map((v) => parseFloat(v.trim()));
  const a = parts[0];
  const b = parts[1];
  if (a === undefined || b === undefined) return 0;
  return (Math.atan2(b, a) * 180) / Math.PI;
}

/**
 * Drives the wheel rotation via a single CSS transition. While the transition
 * runs, the hook samples `getComputedStyle().transform` on every animation
 * frame so the caller can render a live indicator beneath the pointer.
 */
export function useWheelAnimation(
  target: SpinTarget | null,
  onSpinEnd: () => void,
): {
  /** Cumulative rotation passed to the SVG `transform`. */
  rotation: number;
  /** Live angle (degrees, mod 360) of the wheel — updated on every frame. */
  liveAngle: number;
  /** True while the CSS transition is running. */
  isAnimating: boolean;
  /** Ref to attach to the rotating SVG element so the hook can read its style. */
  ref: (el: SVGGElement | null) => void;
} {
  const [rotation, setRotation] = useState(0);
  const [liveAngle, setLiveAngle] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cumulativeRef = useRef(0);
  const lastNonce = useRef<number | null>(null);
  const elementRef = useRef<SVGGElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const endTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!target) return;
    if (target.nonce === lastNonce.current) return;
    lastNonce.current = target.nonce;

    const next = nextRotation(cumulativeRef.current, target);
    cumulativeRef.current = next;
    setRotation(next);
    setIsAnimating(true);

    const tick = (): void => {
      const el = elementRef.current;
      if (el) {
        const cs = window.getComputedStyle(el);
        setLiveAngle(((decodeRotation(cs.transform) % 360) + 360) % 360);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    endTimeoutRef.current = setTimeout(() => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      setIsAnimating(false);
      setLiveAngle(((next % 360) + 360) % 360);
      onSpinEnd();
    }, target.durationMs);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (endTimeoutRef.current !== null) clearTimeout(endTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.nonce]);

  return {
    rotation,
    liveAngle,
    isAnimating,
    ref: (el: SVGGElement | null) => {
      elementRef.current = el;
    },
  };
}

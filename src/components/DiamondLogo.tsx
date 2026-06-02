import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors } from "../data/theme";

/**
 * Logo aux trois diamants Mitsubishi, dessiné en SVG et animé.
 * Les trois losanges apparaissent en cascade puis flottent légèrement.
 */

type Props = {
  size?: number;
  /** Frame à laquelle l'animation d'entrée démarre. */
  startFrame?: number;
  /** Désactive le flottement (utile pour une carte titre figée). */
  still?: boolean;
};

// Un losange dont la pointe interne est proche du centre (0,0), orienté vers le haut.
const GAP = 14; // espace au centre entre les diamants
const WIDTH = 70; // demi-largeur au point le plus large
const LENGTH = 150; // longueur du losange
const MID = LENGTH * 0.4; // position du point large

const rhombusPoints = [
  `0,${-GAP}`,
  `${WIDTH},${-GAP - MID}`,
  `0,${-GAP - LENGTH}`,
  `${-WIDTH},${-GAP - MID}`,
].join(" ");

export const DiamondLogo: React.FC<Props> = ({
  size = 320,
  startFrame = 0,
  still = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;

  const float = still
    ? 0
    : Math.sin((frame / fps) * 1.3) * 6;

  return (
    <svg
      width={size}
      height={size}
      viewBox="-180 -180 360 360"
      style={{
        overflow: "visible",
        transform: `translateY(${float}px)`,
      }}
    >
      <defs>
        <linearGradient id="diamondGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.diamondRed} />
          <stop offset="100%" stopColor={colors.diamondRedDark} />
        </linearGradient>
        <filter id="diamondGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {[0, 120, 240].map((angle, i) => {
        const appear = spring({
          frame: local - i * 6,
          fps,
          config: { damping: 14, stiffness: 120, mass: 0.6 },
        });
        const scale = interpolate(appear, [0, 1], [0.2, 1]);
        const opacity = interpolate(appear, [0, 1], [0, 1]);
        return (
          <g
            key={angle}
            transform={`rotate(${angle}) scale(${scale})`}
            opacity={opacity}
            style={{ transformOrigin: "0px 0px" }}
          >
            <polygon
              points={rhombusPoints}
              fill="url(#diamondGrad)"
              filter="url(#diamondGlow)"
            />
          </g>
        );
      })}
    </svg>
  );
};

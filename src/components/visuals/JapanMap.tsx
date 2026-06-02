import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors } from "../../data/theme";

/**
 * Carte stylisée du Japon (silhouette simplifiée) avec un repère animé
 * sur la province de Tosa (île de Shikoku).
 */
export const JapanMap: React.FC = () => {
  const frame = useCurrentFrame();
  const pinScale = interpolate(frame % 90, [0, 45, 90], [1, 1.25, 1]);
  const draw = interpolate(frame, [0, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <svg
      width={760}
      height={760}
      viewBox="0 0 400 400"
      style={{ filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.6))" }}
    >
      {/* Silhouette très simplifiée de l'archipel japonais. */}
      <g
        fill="none"
        stroke={colors.steel}
        strokeWidth={3}
        strokeLinejoin="round"
        opacity={0.9}
        strokeDasharray={1400}
        strokeDashoffset={1400 * (1 - draw)}
      >
        {/* Honshu */}
        <path d="M150 90 q40 -20 70 10 q30 30 20 70 q-10 40 -50 55 q-40 15 -70 -10 q-25 -25 -10 -65 q15 -45 40 -55Z" />
        {/* Hokkaido (haut droite) */}
        <path d="M250 60 q25 -15 40 5 q15 25 -5 45 q-25 15 -40 -10 q-10 -25 5 -40Z" />
        {/* Kyushu (bas gauche) */}
        <path d="M120 230 q20 -10 30 10 q10 25 -10 40 q-25 10 -35 -15 q-5 -25 15 -35Z" />
      </g>
      {/* Repère sur Tosa / Shikoku */}
      <g transform="translate(165 250)">
        <circle
          r={10 * pinScale}
          fill={colors.diamondRed}
          opacity={0.95}
        />
        <circle r={20 * pinScale} fill="none" stroke={colors.diamondRed} strokeWidth={2} opacity={0.4} />
        <text
          x={18}
          y={6}
          fill={colors.textSecondary}
          fontSize={16}
          fontFamily="Inter, sans-serif"
        >
          Province de Tosa
        </text>
      </g>
    </svg>
  );
};

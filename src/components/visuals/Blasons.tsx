import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../../data/theme";
import { DiamondLogo } from "../DiamondLogo";

/**
 * Deux blasons (Tosa = trois feuilles de chêne empilées façon "mitsugashiwa",
 * Iwasaki = trois losanges) qui se rapprochent et fusionnent pour former le
 * logo aux trois diamants.
 */
export const Blasons: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Phase 1 (0-2.5s) : les deux blasons côte à côte.
  // Phase 2 (2.5-4s) : ils se rapprochent et s'estompent.
  // Phase 3 (>4s)   : le logo final apparaît au centre.
  const converge = interpolate(t, [2.5, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const crestOpacity = interpolate(t, [3, 4.2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoStart = Math.round(4 * fps);

  const offset = interpolate(converge, [0, 1], [340, 0]);

  return (
    <div style={{ position: "relative", width: 900, height: 460 }}>
      {/* Blason Tosa (gauche) */}
      <Crest
        x={-offset}
        opacity={crestOpacity}
        label="Clan Tosa"
        color={colors.gold}
      >
        {/* trois feuilles stylisées */}
        <g fill={colors.gold}>
          <ellipse cx="0" cy="-34" rx="20" ry="34" />
          <ellipse cx="-30" cy="22" rx="20" ry="34" transform="rotate(-120 -30 22)" />
          <ellipse cx="30" cy="22" rx="20" ry="34" transform="rotate(120 30 22)" />
        </g>
      </Crest>

      {/* Blason Iwasaki (droite) — trois losanges empilés */}
      <Crest
        x={offset}
        opacity={crestOpacity}
        label="Famille Iwasaki"
        color={colors.diamondRed}
      >
        <g fill={colors.diamondRed}>
          <polygon points="0,-54 22,-30 0,-6 -22,-30" />
          <polygon points="0,-24 22,0 0,24 -22,0" />
          <polygon points="0,6 22,30 0,54 -22,30" />
        </g>
      </Crest>

      {/* Logo final */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: interpolate(t, [4, 4.6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <DiamondLogo size={340} startFrame={logoStart} />
      </div>
    </div>
  );
};

const Crest: React.FC<{
  x: number;
  opacity: number;
  label: string;
  color: string;
  children: React.ReactNode;
}> = ({ x, opacity, label, color, children }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      transform: `translateX(${x}px)`,
      opacity,
    }}
  >
    <svg width={200} height={200} viewBox="-100 -100 200 200">
      <circle r={88} fill="none" stroke={color} strokeWidth={4} opacity={0.5} />
      {children}
    </svg>
    <span
      style={{
        marginTop: 14,
        fontFamily: fonts.body,
        fontSize: 22,
        color: colors.textSecondary,
        letterSpacing: "1px",
      }}
    >
      {label}
    </span>
  </div>
);

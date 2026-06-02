import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../../data/theme";

/**
 * Schéma en arbre du zaibatsu : la famille au sommet, les branches en dessous.
 */
const branches = ["Banque", "Mines", "Maritime", "Industrie", "Commerce"];

export const ZaibatsuTree: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const root = spring({ frame, fps, config: { damping: 16 } });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
      }}
    >
      {/* Sommet : la famille */}
      <div
        style={{
          opacity: root,
          transform: `scale(${0.9 + root * 0.1})`,
          padding: "20px 44px",
          borderRadius: 14,
          background: colors.diamondRed,
          color: "#fff",
          fontFamily: fonts.display,
          fontSize: 30,
          fontWeight: 800,
          boxShadow: "0 18px 50px rgba(230,0,18,0.35)",
        }}
      >
        Famille Iwasaki
      </div>

      {/* Connecteurs */}
      <svg width={900} height={90}>
        <line x1={450} y1={0} x2={450} y2={30} stroke={colors.textMuted} strokeWidth={3} />
        <line x1={90} y1={30} x2={810} y2={30} stroke={colors.textMuted} strokeWidth={3} />
        {branches.map((_, i) => {
          const x = 90 + i * 180;
          return <line key={i} x1={x} y1={30} x2={x} y2={70} stroke={colors.textMuted} strokeWidth={3} />;
        })}
      </svg>

      {/* Branches */}
      <div style={{ display: "flex", gap: 40 }}>
        {branches.map((b, i) => {
          const appear = spring({
            frame: frame - 10 - i * 6,
            fps,
            config: { damping: 15, stiffness: 120 },
          });
          return (
            <div
              key={b}
              style={{
                opacity: appear,
                transform: `translateY(${(1 - appear) * 20}px)`,
                padding: "16px 26px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${colors.steel}55`,
                color: colors.textSecondary,
                fontFamily: fonts.body,
                fontSize: 22,
              }}
            >
              {b}
            </div>
          );
        })}
      </div>
    </div>
  );
};

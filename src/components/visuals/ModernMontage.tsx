import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../../data/theme";

/**
 * Skyline moderne de Tokyo (silhouette de gratte-ciels qui montent)
 * + étiquettes des grandes branches du groupe.
 */
const buildings = [
  { w: 80, h: 220 },
  { w: 110, h: 340 },
  { w: 70, h: 180 },
  { w: 130, h: 420 },
  { w: 90, h: 280 },
  { w: 120, h: 380 },
  { w: 75, h: 200 },
  { w: 100, h: 320 },
];

const branchLabels = ["Heavy Industries", "Motors", "Electric", "Bank", "Chemical"];

export const ModernMontage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 50,
      }}
    >
      {/* Étiquettes des branches */}
      <div style={{ display: "flex", gap: 26, flexWrap: "wrap", justifyContent: "center", maxWidth: 1200 }}>
        {branchLabels.map((b, i) => {
          const appear = spring({
            frame: frame - i * 6,
            fps,
            config: { damping: 16 },
          });
          return (
            <div
              key={b}
              style={{
                opacity: appear,
                transform: `translateY(${(1 - appear) * 16}px)`,
                padding: "12px 24px",
                borderRadius: 999,
                border: `1px solid ${colors.diamondRed}`,
                color: colors.textPrimary,
                fontFamily: fonts.body,
                fontSize: 22,
              }}
            >
              Mitsubishi {b}
            </div>
          );
        })}
      </div>

      {/* Skyline */}
      <svg width={1100} height={460} viewBox="0 0 1100 460" style={{ display: "block" }}>
        {buildings.map((b, i) => {
          const x = 70 + i * 125;
          const grow = interpolate(
            spring({ frame: frame - i * 4, fps, config: { damping: 18 } }),
            [0, 1],
            [0, b.h],
          );
          return (
            <g key={i}>
              <rect
                x={x}
                y={460 - grow}
                width={b.w}
                height={grow}
                fill="#11161d"
                stroke={colors.steel}
                strokeWidth={1.5}
                opacity={0.9}
              />
              {/* quelques fenêtres allumées */}
              {grow > 40 &&
                [0, 1, 2].map((c) =>
                  [0, 1, 2, 3].map((r) => (
                    <rect
                      key={`${c}-${r}`}
                      x={x + 12 + c * (b.w / 3)}
                      y={460 - grow + 20 + r * 40}
                      width={10}
                      height={14}
                      fill={(i + c + r) % 3 === 0 ? colors.gold : "#1d2630"}
                      opacity={0.8}
                    />
                  )),
                )}
            </g>
          );
        })}
      </svg>

      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 20,
          color: colors.textMuted,
          letterSpacing: "3px",
          textTransform: "uppercase",
        }}
      >
        Tokyo — aujourd'hui
      </div>
    </div>
  );
};

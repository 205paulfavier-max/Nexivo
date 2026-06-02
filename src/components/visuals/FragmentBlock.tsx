import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../../data/theme";

/**
 * Un bloc unique "MITSUBISHI" qui se fragmente en plusieurs morceaux —
 * illustration du démantèlement du zaibatsu en 1946.
 */
const pieces = [
  { dx: -360, dy: -40, rot: -12, label: "Heavy Ind." },
  { dx: -120, dy: 60, rot: 8, label: "Banque" },
  { dx: 140, dy: -70, rot: -6, label: "Corporation" },
  { dx: 380, dy: 50, rot: 14, label: "Electric" },
];

export const FragmentBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Le bloc tient jusqu'à ~2.5s, puis explose doucement.
  const split = interpolate(t, [2.5, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "relative", width: 900, height: 360 }}>
      {/* Bloc entier (s'estompe quand il se fragmente). */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 1 - split,
        }}
      >
        <div
          style={{
            padding: "40px 80px",
            borderRadius: 16,
            background: colors.diamondRed,
            color: "#fff",
            fontFamily: fonts.display,
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: "4px",
          }}
        >
          MITSUBISHI
        </div>
      </div>

      {/* Morceaux qui se dispersent. */}
      {pieces.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: split,
            transform: `translate(${p.dx * split}px, ${p.dy * split}px) rotate(${
              p.rot * split
            }deg)`,
          }}
        >
          <div
            style={{
              padding: "20px 30px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.06)",
              border: `2px solid ${colors.diamondRed}88`,
              color: colors.textPrimary,
              fontFamily: fonts.body,
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            {p.label}
          </div>
        </div>
      ))}
    </div>
  );
};

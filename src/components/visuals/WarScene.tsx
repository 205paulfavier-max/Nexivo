import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../../data/theme";

/**
 * Plan grave : silhouette de l'avion A6M "Zéro" qui traverse lentement
 * un ciel sombre. Placeholder digne pour les passages de guerre.
 */
export const WarScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // L'avion traverse de gauche à droite.
  const x = interpolate(t, [0, 14], [-400, 2200], {
    extrapolateRight: "clamp",
  });
  const y = 360 + Math.sin(t * 0.6) * 30;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Ligne d'horizon discrète */}
      <div
        style={{
          position: "absolute",
          bottom: "32%",
          left: 0,
          right: 0,
          height: 1,
          background: "rgba(255,255,255,0.08)",
        }}
      />
      <svg
        width={360}
        height={160}
        viewBox="0 0 360 160"
        style={{
          position: "absolute",
          left: x,
          top: y,
          opacity: 0.85,
        }}
      >
        {/* Silhouette d'avion de chasse, vue de profil. */}
        <g fill="#0c0c0c" stroke="#222" strokeWidth={1}>
          <path d="M20 80 L250 70 q60 0 80 12 q-20 8 -80 8 L60 92 q-30 0 -40 -12Z" />
          <path d="M120 74 L150 30 L168 32 L150 76Z" />
          <path d="M120 86 L150 130 L168 128 L150 84Z" />
          <path d="M30 72 L10 50 L24 52 L46 70Z" />
          <circle cx="40" cy="80" r="8" fill="#000" />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: fonts.body,
          fontSize: 22,
          color: colors.textMuted,
          letterSpacing: "3px",
          textTransform: "uppercase",
        }}
      >
        Mitsubishi A6M « Zéro » — 1940
      </div>
    </div>
  );
};

import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors } from "../../data/theme";

/**
 * Plan factuel sobre pour les passages graves (travail forcé, excuses).
 * Volontairement minimaliste : fond noir + deux fines lignes rouges qui
 * encadrent un espace dans la moitié haute. Toute la charge est portée
 * par le texte du sous-titre, en bas.
 */
export const FactText: React.FC = () => {
  const frame = useCurrentFrame();
  const width = interpolate(frame, [0, 30], [0, 460], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "26%",
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 220,
      }}
    >
      <div style={{ height: 2, width, background: colors.diamondRed, opacity: 0.65 }} />
      <div style={{ height: 2, width, background: colors.diamondRed, opacity: 0.65 }} />
    </div>
  );
};

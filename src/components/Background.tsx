import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, Tone, toneBackground } from "../data/theme";

/**
 * Fond animé dépendant du ton émotionnel de la séquence.
 * Gradient lent + vignette + léger grain visuel via deux halos qui dérivent.
 */

const haloColor: Record<Tone, string> = {
  intro: colors.diamondRed,
  normal: colors.steel,
  epic: colors.diamondRed,
  grave: "#3a3a3a",
  hopeful: colors.steel,
  outro: colors.diamondRed,
};

export const Background: React.FC<{ tone: Tone }> = ({ tone }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const base = toneBackground[tone];
  const halo = haloColor[tone];

  // Deux halos qui dérivent doucement.
  const x1 = 30 + Math.sin(t * 0.25) * 12;
  const y1 = 35 + Math.cos(t * 0.2) * 10;
  const x2 = 72 + Math.cos(t * 0.18) * 12;
  const y2 = 68 + Math.sin(t * 0.22) * 10;

  const haloOpacity = tone === "grave" ? 0.1 : 0.22;

  return (
    <AbsoluteFill style={{ backgroundColor: base }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(40% 50% at ${x1}% ${y1}%, ${halo}${Math.round(
            haloOpacity * 255,
          )
            .toString(16)
            .padStart(2, "0")} 0%, transparent 60%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(45% 55% at ${x2}% ${y2}%, ${halo}${Math.round(
            haloOpacity * 0.7 * 255,
          )
            .toString(16)
            .padStart(2, "0")} 0%, transparent 60%)`,
        }}
      />
      {/* Vignette pour ancrer le regard au centre. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(70% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

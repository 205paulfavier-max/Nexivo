import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts } from "../data/theme";

/**
 * Sous-titre voix-off. Apparaît par fondu + léger glissement vers le haut,
 * disparaît en fondu sur la fin. Les passages `emphasis` sont plus gros.
 */

type Props = {
  text: string;
  /** Durée totale d'affichage de ce sous-titre, en frames. */
  durationInFrames: number;
  emphasis?: boolean;
  source?: string;
};

export const Caption: React.FC<Props> = ({
  text,
  durationInFrames,
  emphasis,
  source,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 90, mass: 0.7 },
  });

  // Fondu de sortie sur les 12 dernières frames.
  const exit = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const opacity = Math.min(enter, exit);
  const translateY = interpolate(enter, [0, 1], [24, 0]);

  return (
    <div
      style={{
        position: "absolute",
        // Les passages en emphase sont plus gros et placés un peu plus haut,
        // mais restent sous le visuel centré pour éviter tout chevauchement.
        bottom: emphasis ? 260 : 160,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 200px",
        transform: `translateY(${translateY}px)`,
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: emphasis ? fonts.display : fonts.body,
          fontSize: emphasis ? 64 : 42,
          fontWeight: emphasis ? 800 : 500,
          lineHeight: 1.25,
          color: colors.textPrimary,
          textAlign: "center",
          textShadow: "0 4px 24px rgba(0,0,0,0.85)",
          letterSpacing: emphasis ? "-0.5px" : "0",
          maxWidth: 1400,
        }}
      >
        {text}
      </div>

      {source ? (
        <div
          style={{
            marginTop: 18,
            fontFamily: fonts.body,
            fontSize: 18,
            color: colors.textMuted,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          Source {source}
        </div>
      ) : null}
    </div>
  );
};

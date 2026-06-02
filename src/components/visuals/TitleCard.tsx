import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../../data/theme";
import { DiamondLogo } from "../DiamondLogo";

/** Carte titre principale : logo + "MITSUBISHI". */
export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({ frame: frame - 10, fps, config: { damping: 18 } });
  const letterSpacing = interpolate(reveal, [0, 1], [40, 16]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
      }}
    >
      <DiamondLogo size={280} startFrame={0} />
      <div
        style={{
          opacity: reveal,
          fontFamily: fonts.display,
          fontSize: 130,
          fontWeight: 900,
          color: colors.textPrimary,
          letterSpacing: `${letterSpacing}px`,
          textShadow: "0 8px 40px rgba(0,0,0,0.8)",
        }}
      >
        MITSUBISHI
      </div>
      <div
        style={{
          opacity: interpolate(reveal, [0.4, 1], [0, 1], {
            extrapolateLeft: "clamp",
          }),
          fontFamily: fonts.body,
          fontSize: 28,
          color: colors.diamondRed,
          letterSpacing: "8px",
          textTransform: "uppercase",
        }}
      >
        1870 — Aujourd'hui
      </div>
    </div>
  );
};

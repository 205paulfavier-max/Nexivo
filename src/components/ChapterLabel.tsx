import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../data/theme";

/**
 * Étiquette de chapitre affichée brièvement en haut à gauche au début
 * de chaque séquence. Glisse depuis la gauche, puis disparaît en fondu.
 */
export const ChapterLabel: React.FC<{ number: number; title: string }> = ({
  number,
  title,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = Math.round(3.2 * fps);

  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 90 } });
  const exit = interpolate(frame, [dur - 14, dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(enter, exit);
  const x = interpolate(enter, [0, 1], [-60, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 90,
        left: 110,
        display: "flex",
        alignItems: "center",
        gap: 20,
        opacity,
        transform: `translateX(${x}px)`,
      }}
    >
      <div
        style={{
          width: 6,
          height: 64,
          background: colors.diamondRed,
          borderRadius: 3,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontFamily: fonts.body,
            fontSize: 20,
            color: colors.diamondRed,
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          Chapitre {number}
        </span>
        <span
          style={{
            fontFamily: fonts.display,
            fontSize: 38,
            fontWeight: 800,
            color: colors.textPrimary,
            textShadow: "0 4px 20px rgba(0,0,0,0.7)",
          }}
        >
          {title}
        </span>
      </div>
    </div>
  );
};

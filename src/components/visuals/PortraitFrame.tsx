import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../../data/theme";

/**
 * Cadre portrait d'époque (placeholder). À remplacer par une vraie image
 * d'archive de Yataro Iwasaki en déposant un fichier et en y plaçant un <Img>.
 */
export const PortraitFrame: React.FC<{ label?: string; year?: string }> = ({
  label = "Yataro Iwasaki",
  year = "1835 – 1885",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 16 } });
  const scale = interpolate(enter, [0, 1], [0.92, 1]);

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity: enter,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 420,
          height: 520,
          borderRadius: 8,
          border: `6px solid ${colors.gold}`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
          background:
            "linear-gradient(160deg, #2a2620 0%, #15120d 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Silhouette neutre en attendant la vraie photo. */}
        <svg width={260} height={300} viewBox="0 0 260 300" opacity={0.5}>
          <circle cx={130} cy={95} r={62} fill={colors.gold} opacity={0.35} />
          <path
            d="M30 300 q0 -120 100 -120 q100 0 100 120Z"
            fill={colors.gold}
            opacity={0.35}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: colors.gold,
            opacity: 0.6,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 22,
          fontFamily: fonts.display,
          fontSize: 34,
          fontWeight: 700,
          color: colors.textPrimary,
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 4,
          fontFamily: fonts.body,
          fontSize: 20,
          color: colors.gold,
          letterSpacing: "2px",
        }}
      >
        {year}
      </div>
    </div>
  );
};

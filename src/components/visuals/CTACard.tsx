import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../../data/theme";

/** Carte de fin : appel à l'abonnement + suggestions d'entreprises. */
const choices = ["Total", "Samsung", "Nestlé"];

export const CTACard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = spring({ frame, fps, config: { damping: 18 } });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}
    >
      <div
        style={{
          opacity: title,
          transform: `translateY(${(1 - title) * 20}px)`,
          fontFamily: fonts.display,
          fontSize: 56,
          fontWeight: 800,
          color: colors.textPrimary,
        }}
      >
        Quelle entreprise, ensuite&nbsp;?
      </div>
      <div style={{ display: "flex", gap: 30 }}>
        {choices.map((c, i) => {
          const appear = spring({
            frame: frame - 12 - i * 7,
            fps,
            config: { damping: 14, stiffness: 120 },
          });
          return (
            <div
              key={c}
              style={{
                opacity: appear,
                transform: `scale(${0.85 + appear * 0.15})`,
                padding: "22px 50px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.05)",
                border: `2px solid ${colors.diamondRed}`,
                color: colors.textPrimary,
                fontFamily: fonts.display,
                fontSize: 36,
                fontWeight: 700,
              }}
            >
              {c}
            </div>
          );
        })}
      </div>
      <div
        style={{
          opacity: spring({ frame: frame - 30, fps, config: { damping: 18 } }),
          fontFamily: fonts.body,
          fontSize: 24,
          color: colors.textSecondary,
          letterSpacing: "2px",
        }}
      >
        Abonne-toi pour la prochaine histoire ▸
      </div>
    </div>
  );
};

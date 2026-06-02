import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../../data/theme";
import { iconByName, IconName } from "./Icons";

/**
 * Montage de cartes-icônes qui apparaissent en cascade.
 * Sert pour les passages "navires, avions, banques, voitures…".
 */

const items: { icon: IconName; label: string }[] = [
  { icon: "ship", label: "Navires" },
  { icon: "plane", label: "Aviation" },
  { icon: "bank", label: "Banque" },
  { icon: "factory", label: "Industrie" },
  { icon: "mine", label: "Mines" },
  { icon: "car", label: "Automobile" },
];

export const IconMontage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 260px)",
        gap: 40,
        justifyContent: "center",
      }}
    >
      {items.map((item, i) => {
        const Icon = iconByName[item.icon];
        const appear = spring({
          frame: frame - i * 7,
          fps,
          config: { damping: 16, stiffness: 110 },
        });
        return (
          <div
            key={item.label}
            style={{
              opacity: appear,
              transform: `translateY(${(1 - appear) * 30}px) scale(${
                0.9 + appear * 0.1
              })`,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 18,
              padding: "34px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
            }}
          >
            <Icon size={104} color={colors.steel} />
            <span
              style={{
                fontFamily: fonts.body,
                fontSize: 24,
                color: colors.textSecondary,
                letterSpacing: "1px",
              }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

import React from "react";
import { colors } from "../../data/theme";

/**
 * Petites icônes vectorielles maison (style ligne) utilisées dans les montages.
 * Volontairement simples et cohérentes entre elles.
 */

type IconProps = { size?: number; color?: string };

const base = (color: string) => ({
  fill: "none",
  stroke: color,
  strokeWidth: 4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const ShipIcon: React.FC<IconProps> = ({ size = 96, color = colors.steel }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" {...base(color)}>
    <path d="M18 62 h64 l-10 22 a8 8 0 0 1 -7 4 H35 a8 8 0 0 1 -7 -4 Z" />
    <path d="M50 20 v38 M50 28 h26 l-10 14 H50" />
    <path d="M12 70 q10 8 19 0 q9 -8 19 0 q10 8 19 0 q9 -8 19 0" />
  </svg>
);

export const PlaneIcon: React.FC<IconProps> = ({ size = 96, color = colors.steel }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" {...base(color)}>
    <path d="M50 14 c6 0 8 10 8 22 l24 16 v8 l-24 -8 v18 l8 8 v6 l-16 -5 l-16 5 v-6 l8 -8 v-18 l-24 8 v-8 l24 -16 c0 -12 2 -22 8 -22Z" />
  </svg>
);

export const BankIcon: React.FC<IconProps> = ({ size = 96, color = colors.steel }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" {...base(color)}>
    <path d="M16 38 L50 18 L84 38 Z" />
    <path d="M22 44 v30 M40 44 v30 M60 44 v30 M78 44 v30" />
    <path d="M14 80 h72" />
  </svg>
);

export const CarIcon: React.FC<IconProps> = ({ size = 96, color = colors.steel }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" {...base(color)}>
    <path d="M14 64 l6 -20 a8 8 0 0 1 8 -6 h44 a8 8 0 0 1 8 6 l6 20" />
    <path d="M10 64 h80 v10 a4 4 0 0 1 -4 4 h-6 M30 78 H18 a4 4 0 0 1 -4 -4 v-10" />
    <circle cx={30} cy={78} r={7} />
    <circle cx={70} cy={78} r={7} />
  </svg>
);

export const MineIcon: React.FC<IconProps> = ({ size = 96, color = colors.steel }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" {...base(color)}>
    <path d="M24 76 L46 34 a6 6 0 0 1 10 0 L60 44" />
    <path d="M60 30 l24 24 M84 30 l-24 24" />
    <path d="M16 76 h60 l-6 8 H22 Z" />
  </svg>
);

export const FactoryIcon: React.FC<IconProps> = ({ size = 96, color = colors.steel }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" {...base(color)}>
    <path d="M16 80 V46 l22 14 V46 l22 14 V32 h22 v48 Z" />
    <path d="M26 26 h12 v20 M70 22 v10" />
  </svg>
);

export const iconByName = {
  ship: ShipIcon,
  plane: PlaneIcon,
  bank: BankIcon,
  car: CarIcon,
  mine: MineIcon,
  factory: FactoryIcon,
};

export type IconName = keyof typeof iconByName;

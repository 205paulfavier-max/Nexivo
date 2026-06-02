/**
 * Charte graphique de la vidéo.
 * Centralisée ici pour garder une cohérence visuelle sur toutes les séquences.
 */

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const colors = {
  // Rouge des trois diamants Mitsubishi
  diamondRed: "#e60012",
  diamondRedDark: "#a3000c",

  // Fonds
  bgDark: "#0a0c10",
  bgDarker: "#050608",
  bgGrave: "#000000", // séquences graves (travail forcé, guerre)
  bgHopeful: "#0d1b2a", // séquences renaissance

  // Textes
  textPrimary: "#f5f5f5",
  textSecondary: "#b8bdc7",
  textMuted: "#6b7280",

  // Accents
  gold: "#c9a227", // ancien monde / blasons
  steel: "#5b7a99", // industrie / acier
};

export const fonts = {
  // Remplies dynamiquement par @remotion/google-fonts dans les composants.
  display: '"Montserrat", system-ui, sans-serif',
  body: '"Inter", system-ui, sans-serif',
};

/** Ton émotionnel d'une séquence — pilote l'ambiance visuelle. */
export type Tone = "intro" | "normal" | "epic" | "grave" | "hopeful" | "outro";

export const toneBackground: Record<Tone, string> = {
  intro: colors.bgDarker,
  normal: colors.bgDark,
  epic: colors.bgDark,
  grave: colors.bgGrave,
  hopeful: colors.bgHopeful,
  outro: colors.bgDarker,
};

// Jetons de design, palette et typographie, source unique pour le code.
// Reflete la configuration Tailwind, utile pour les rendus SVG et Canvas
// ou les couleurs Tailwind ne sont pas disponibles directement.

export const palette = {
  fond: '#0A0C0F',
  surface: '#12161C',
  bordure: '#1E2630',
  ambre: '#F2A33C', // energie et production
  acier: '#3FB6C9', // donnee et pilotage
  recup: '#4FB477', // boucle circulaire
  texte: '#E6EAEF',
  attenue: '#8A95A3',
} as const

export const typographie = {
  corps: "'Inter', system-ui, sans-serif",
  donnees: "'JetBrains Mono', monospace",
} as const

// Couleur associee a une industrie, pour les pastilles et schemas.
export const couleurIndustrie: Record<string, string> = {
  hydrogene: palette.ambre,
  eau: palette.acier,
  chimie: palette.recup,
  datacenter: '#9B8CFF',
  semiconducteurs: '#E06C9F',
}

import type { Industrie, IndustrieId } from '../simulation/types'

// Liste des industries cibles. Donnees illustratives.
export const industries: Industrie[] = [
  { id: 'hydrogene', nom: 'Hydrogene' },
  { id: 'eau', nom: 'Eau' },
  { id: 'chimie', nom: 'Chimie' },
  { id: 'datacenter', nom: 'Data center' },
  { id: 'semiconducteurs', nom: 'Semi conducteurs' },
]

// Acces rapide au nom lisible d'une industrie.
export const nomIndustrie = (id: IndustrieId): string =>
  industries.find((i) => i.id === id)?.nom ?? id

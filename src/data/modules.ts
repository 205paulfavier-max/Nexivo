import type { ModulePEA } from '../simulation/types'

// Bibliotheque de modules PEA. Donnees illustratives, pas validees.
// La signature MTP liste des jetons d'interface (fluide, electrique, donnee).
// Deux modules se branchent si leurs signatures partagent au moins un jeton.
export const modulesPEA: ModulePEA[] = [
  {
    id: 'pea-compression-h2',
    nom: 'Module de compression hydrogene',
    fonction: 'Comprime l hydrogene gazeux vers la pression de stockage ou de distribution.',
    industriesCompatibles: ['hydrogene', 'chimie'],
    signatureMTP: 'fluide-gaz-hp data-opcua elec-400v',
    classeDelai: 'long',
    masseKg: 1850,
    valeurResiduelle: 9200,
    composition: { acier: 38, inox: 30, cuivre: 12, electronique: 10, autre: 10 },
  },
  {
    id: 'pea-electrolyse-pem',
    nom: 'Module d electrolyse PEM',
    fonction: 'Produit de l hydrogene par electrolyse a membrane echangeuse de protons.',
    industriesCompatibles: ['hydrogene'],
    signatureMTP: 'fluide-eau data-opcua elec-400v',
    classeDelai: 'long',
    masseKg: 2400,
    valeurResiduelle: 14500,
    composition: { acier: 20, inox: 28, cuivre: 14, electronique: 30, autre: 8 },
  },
  {
    id: 'pea-filtration',
    nom: 'Module de filtration',
    fonction: 'Filtre et clarifie les fluides de procede selon le seuil cible.',
    industriesCompatibles: ['eau', 'chimie', 'hydrogene', 'semiconducteurs'],
    signatureMTP: 'fluide-eau data-opcua',
    classeDelai: 'court',
    masseKg: 620,
    valeurResiduelle: 2100,
    composition: { acier: 30, inox: 40, cuivre: 4, electronique: 8, autre: 18 },
  },
  {
    id: 'pea-echange-thermique',
    nom: 'Module d echange thermique',
    fonction: 'Transfere la chaleur entre deux circuits pour la regulation de temperature.',
    industriesCompatibles: ['chimie', 'datacenter', 'hydrogene', 'eau'],
    signatureMTP: 'fluide-eau fluide-gaz-hp data-opcua',
    classeDelai: 'moyen',
    masseKg: 980,
    valeurResiduelle: 3400,
    composition: { acier: 26, inox: 34, cuivre: 28, electronique: 4, autre: 8 },
  },
  {
    id: 'pea-instrumentation',
    nom: 'Module d instrumentation',
    fonction: 'Mesure pression, debit et temperature, et expose les donnees en OPC UA.',
    industriesCompatibles: ['hydrogene', 'eau', 'chimie', 'datacenter', 'semiconducteurs'],
    signatureMTP: 'data-opcua elec-24v',
    classeDelai: 'court',
    masseKg: 140,
    valeurResiduelle: 1600,
    composition: { acier: 12, inox: 18, cuivre: 16, electronique: 48, autre: 6 },
  },
  {
    id: 'pea-tableau-electrique',
    nom: 'Module de tableau electrique',
    fonction: 'Distribue et protege l alimentation electrique des autres modules.',
    industriesCompatibles: ['hydrogene', 'eau', 'chimie', 'datacenter', 'semiconducteurs'],
    signatureMTP: 'elec-400v elec-24v data-opcua',
    classeDelai: 'moyen',
    masseKg: 540,
    valeurResiduelle: 4100,
    composition: { acier: 28, inox: 8, cuivre: 34, electronique: 24, autre: 6 },
  },
  {
    id: 'pea-pompage',
    nom: 'Module de pompage',
    fonction: 'Met en mouvement les fluides de procede au debit demande.',
    industriesCompatibles: ['eau', 'chimie', 'hydrogene'],
    signatureMTP: 'fluide-eau elec-400v data-opcua',
    classeDelai: 'court',
    masseKg: 410,
    valeurResiduelle: 1900,
    composition: { acier: 34, inox: 30, cuivre: 22, electronique: 6, autre: 8 },
  },
  {
    id: 'pea-dosage-chimique',
    nom: 'Module de dosage chimique',
    fonction: 'Injecte des reactifs avec precision selon la recette de procede.',
    industriesCompatibles: ['chimie', 'eau', 'semiconducteurs'],
    signatureMTP: 'fluide-eau data-opcua elec-24v',
    classeDelai: 'moyen',
    masseKg: 300,
    valeurResiduelle: 2600,
    composition: { acier: 18, inox: 36, cuivre: 8, electronique: 28, autre: 10 },
  },
  {
    id: 'pea-refroidissement-liquide',
    nom: 'Module de refroidissement liquide',
    fonction: 'Refroidit les baies de calcul par boucle liquide directe.',
    industriesCompatibles: ['datacenter', 'semiconducteurs'],
    signatureMTP: 'fluide-eau elec-400v data-opcua',
    classeDelai: 'moyen',
    masseKg: 720,
    valeurResiduelle: 3000,
    composition: { acier: 24, inox: 30, cuivre: 30, electronique: 10, autre: 6 },
  },
  {
    id: 'pea-ultrapure',
    nom: 'Module d eau ultrapure',
    fonction: 'Produit de l eau ultrapure pour les procedes sensibles.',
    industriesCompatibles: ['semiconducteurs', 'eau'],
    signatureMTP: 'fluide-eau data-opcua elec-24v',
    classeDelai: 'long',
    masseKg: 880,
    valeurResiduelle: 5200,
    composition: { acier: 22, inox: 44, cuivre: 6, electronique: 20, autre: 8 },
  },
]

// Recherche d'un module par identifiant.
export const moduleParId = (id: string): ModulePEA | undefined =>
  modulesPEA.find((m) => m.id === id)

// Deux modules sont compatibles au sens MTP si leurs signatures
// partagent au moins un jeton d'interface.
export const signaturesCompatibles = (a: string, b: string): boolean => {
  const jetonsA = new Set(a.split(' '))
  return b.split(' ').some((j) => jetonsA.has(j))
}

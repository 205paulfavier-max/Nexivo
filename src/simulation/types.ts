// Modele de donnees du systeme GENESIS.
// Donnees illustratives, pas des donnees d'ingenierie validees.

// Industries cibles servies par les usines modulaires.
export type IndustrieId =
  | 'hydrogene'
  | 'eau'
  | 'chimie'
  | 'datacenter'
  | 'semiconducteurs'

export interface Industrie {
  id: IndustrieId
  nom: string
}

// Classe de delai d'approvisionnement d'un module.
export type ClasseDelai = 'court' | 'moyen' | 'long'

// Composition matiere en pourcentage, le total vise cent.
export interface CompositionMatiere {
  acier: number
  inox: number
  cuivre: number
  electronique: number
  autre: number
}

// Un ModulePEA, brique fonctionnelle native du standard MTP.
export interface ModulePEA {
  id: string
  nom: string
  fonction: string
  industriesCompatibles: IndustrieId[]
  // Signature d'interface MTP, deux modules se branchent si les signatures concordent.
  signatureMTP: string
  classeDelai: ClasseDelai
  masseKg: number
  valeurResiduelle: number // en euros, valeur de reprise illustrative
  composition: CompositionMatiere
}

// Statut de cycle de vie d'une usine modulaire.
export type StatutCycle =
  | 'conception'
  | 'fabrication'
  | 'exploitation'
  | 'maintenance'
  | 'finDeVie'

// Une UsineModulaire, le produit de GENESIS.
export interface UsineModulaire {
  id: string
  nom: string
  industrieCible: IndustrieId
  modules: ModulePEA[]
  statut: StatutCycle
}

// Parametres pilotables de la simulation.
export interface ParametresSimulation {
  automatisation: number // 0 a 100
  tampon: number // 0 a 100, taille du tampon de stock
  doubleSourcing: boolean // double sourcing actif ou non
  reemploi: number // 0 a 100, taux de reemploi vise
  taktHeures: number // takt en heures
}

// Indicateurs calcules par le moteur de simulation.
export interface IndicateursResultat {
  livraisonOTIF: number // taux de livraison a l'heure et complet, en pourcentage
  delaiSemaines: number // delai moyen en semaines
  rendementPremierPassage: number // en pourcentage
  tauxReprise: number // en pourcentage
  heuresMainOeuvre: number // heures de main d'oeuvre par usine
  reemploiEffectif: number // taux de reemploi effectif, en pourcentage
  valeurMatiereRecuperee: number // en euros par usine en fin de vie
}

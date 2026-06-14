import type {
  IndicateursResultat,
  ModulePEA,
  ParametresSimulation,
} from './types'

// Moteur de simulation, formules illustratives et lisibles.
// AVERTISSEMENT, ces relations sont volontairement simples, elles
// servent la demonstration et ne sont pas de l'ingenierie validee.

// Prix matiere indicatifs en euros par kilo, pour la valeur recuperee.
export const prixMatiere = {
  acier: 0.8,
  inox: 2.5,
  cuivre: 8.0,
  electronique: 12.0,
  autre: 0.5,
} as const

// Borne une valeur dans un intervalle.
const borne = (x: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, x))

// Valeur matiere d'un module en fin de vie, derivee de sa composition et de sa masse.
export const valeurMatiereModule = (m: ModulePEA): number => {
  const c = m.composition
  const eur =
    (c.acier / 100) * m.masseKg * prixMatiere.acier +
    (c.inox / 100) * m.masseKg * prixMatiere.inox +
    (c.cuivre / 100) * m.masseKg * prixMatiere.cuivre +
    (c.electronique / 100) * m.masseKg * prixMatiere.electronique +
    (c.autre / 100) * m.masseKg * prixMatiere.autre
  return Math.round(eur)
}

// Contexte agrege d'une usine, derive de ses modules.
export interface ContexteUsine {
  partLong: number // fraction de modules a classe de delai long, 0 a 1
  valeurMatiereTotale: number // somme des valeurs matiere des modules, en euros
  nbModules: number
}

export const agregerModules = (modules: ModulePEA[]): ContexteUsine => {
  const nb = modules.length
  if (nb === 0) {
    // Usine de reference par defaut, pour le tableau de bord sans selection.
    return { partLong: 0.3, valeurMatiereTotale: 18000, nbModules: 0 }
  }
  const long = modules.filter((m) => m.classeDelai === 'long').length
  const valeur = modules.reduce((s, m) => s + valeurMatiereModule(m), 0)
  return { partLong: long / nb, valeurMatiereTotale: valeur, nbModules: nb }
}

// Coeur du calcul, transforme parametres et contexte en indicateurs.
export const simuler = (
  p: ParametresSimulation,
  ctx: ContexteUsine,
): IndicateursResultat => {
  const { partLong, valeurMatiereTotale } = ctx

  // Livraison a l'heure et complet, montee avec le tampon et le double sourcing,
  // penalisee par la part de modules a delai long.
  const livraisonOTIF = borne(
    72 + 0.18 * p.tampon + (p.doubleSourcing ? 7 : 0) - 24 * partLong,
    40,
    99.5,
  )

  // Delai moyen en semaines, reduit par l'automatisation et le reemploi,
  // alourdi par la part de modules longs et un takt eleve.
  const delaiSemaines = borne(
    6 +
      ((100 - p.automatisation) / 100) * 9 +
      partLong * 10 -
      (p.reemploi / 100) * 4 +
      (p.taktHeures - 8) * 0.15,
    2,
    32,
  )

  // Rendement au premier passage, croit avec l'automatisation.
  const rendementPremierPassage = borne(80 + p.automatisation * 0.17, 60, 99.5)

  // Taux de reprise, pilote par le parametre de reemploi.
  const tauxReprise = borne(5 + p.reemploi * 0.9, 0, 98)

  // Taux de reemploi effectif, legerement sous la cible, aide par l'automatisation.
  const reemploiEffectif = borne(
    p.reemploi * 0.82 + (p.automatisation / 100) * 6,
    0,
    96,
  )

  // Heures de main d'oeuvre par usine, baisse forte avec l'automatisation.
  const heuresMainOeuvre = Math.round(
    200 + ((100 - p.automatisation) / 100) * 1300,
  )

  // Valeur matiere recuperee, fonction de la composition (deja agregee) et du taux de reprise.
  const valeurMatiereRecuperee = Math.round(
    valeurMatiereTotale * (tauxReprise / 100),
  )

  return {
    livraisonOTIF: Math.round(livraisonOTIF * 10) / 10,
    delaiSemaines: Math.round(delaiSemaines * 10) / 10,
    rendementPremierPassage: Math.round(rendementPremierPassage * 10) / 10,
    tauxReprise: Math.round(tauxReprise * 10) / 10,
    heuresMainOeuvre,
    reemploiEffectif: Math.round(reemploiEffectif * 10) / 10,
    valeurMatiereRecuperee,
  }
}

// Parametres par defaut, point de depart de la demonstration.
export const parametresParDefaut: ParametresSimulation = {
  automatisation: 70,
  tampon: 45,
  doubleSourcing: true,
  reemploi: 55,
  taktHeures: 8,
}

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, X, Cable, CheckCircle2, AlertTriangle, Building2 } from 'lucide-react'
import { modulesPEA, signaturesCompatibles } from '../data/modules'
import { industries, nomIndustrie } from '../data/industries'
import type { IndustrieId, ModulePEA, UsineModulaire } from '../simulation/types'
import { BadgeDelai, PastilleIndustrie } from './shared'
import SectionTitre from './SectionTitre'

interface Props {
  usine: UsineModulaire | null
  setUsine: (u: UsineModulaire | null) => void
}

// Vue 3, configurateur d'usine, selection de modules compatibles et assemblage MTP visuel.
export default function PlantConfigurator({ usine, setUsine }: Props) {
  const [industrie, setIndustrie] = useState<IndustrieId>(
    usine?.industrieCible ?? 'hydrogene',
  )
  const [modules, setModules] = useState<ModulePEA[]>(usine?.modules ?? [])

  // Modules compatibles avec l'industrie choisie et non encore ajoutes.
  const disponibles = useMemo(
    () =>
      modulesPEA.filter(
        (m) =>
          m.industriesCompatibles.includes(industrie) &&
          !modules.some((x) => x.id === m.id),
      ),
    [industrie, modules],
  )

  // Compatibilite d'interface entre chaque module ajoute et le reste de l'usine.
  const compatibilite = useMemo(() => {
    return modules.map((m, i) => {
      const autres = modules.filter((_, j) => j !== i)
      if (autres.length === 0) return true
      return autres.some((o) => signaturesCompatibles(m.signatureMTP, o.signatureMTP))
    })
  }, [modules])

  const tousRelies = compatibilite.every(Boolean)

  const changerIndustrie = (id: IndustrieId) => {
    setIndustrie(id)
    setModules([]) // on repart d'une usine vide pour la nouvelle industrie
    setUsine(null)
  }

  const persister = (liste: ModulePEA[]) => {
    setModules(liste)
    setUsine(
      liste.length > 0
        ? {
            id: 'usine-config',
            nom: `Usine ${nomIndustrie(industrie)}`,
            industrieCible: industrie,
            modules: liste,
            statut: 'conception',
          }
        : null,
    )
  }

  const ajouter = (m: ModulePEA) => persister([...modules, m])
  const retirer = (id: string) => persister(modules.filter((m) => m.id !== id))

  return (
    <div className="space-y-5">
      <SectionTitre
        titre="Configurateur d usine"
        sous="Choisissez une industrie, branchez des modules PEA compatibles, et observez l usine s assembler par interface MTP."
      />

      {/* Choix de l'industrie cible */}
      <div className="flex flex-wrap gap-2">
        {industries.map((i) => (
          <button
            key={i.id}
            type="button"
            onClick={() => changerIndustrie(i.id)}
            className={[
              'rounded-sm border px-3 py-1.5 text-xs transition-colors',
              industrie === i.id
                ? 'border-ambre/40 bg-ambre/10 text-ambre'
                : 'border-bordure text-attenue hover:border-acier/40 hover:text-texte',
            ].join(' ')}
          >
            {i.nom}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Modules disponibles */}
        <div className="panneau rounded-sm p-4">
          <h2 className="mb-3 text-sm font-semibold text-texte">
            Modules compatibles, {nomIndustrie(industrie)}
          </h2>
          <ul className="space-y-2">
            {disponibles.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between gap-3 rounded-sm border border-bordure bg-fond px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm text-texte">{m.nom}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <BadgeDelai classe={m.classeDelai} />
                    <span className="compteur text-[10px] text-attenue">
                      {m.signatureMTP}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => ajouter(m)}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-sm border border-recup/40 bg-recup/10 text-recup hover:bg-recup/20"
                  aria-label={`Ajouter ${m.nom}`}
                >
                  <Plus className="h-4 w-4" aria-hidden />
                </button>
              </li>
            ))}
            {disponibles.length === 0 && (
              <li className="rounded-sm border border-dashed border-bordure px-3 py-6 text-center text-xs text-attenue">
                Tous les modules compatibles sont deja dans l usine.
              </li>
            )}
          </ul>
        </div>

        {/* Usine assemblee */}
        <div className="panneau rounded-sm p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-texte">Usine assemblee</h2>
            <span
              className={[
                'inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px]',
                modules.length === 0
                  ? 'border-bordure text-attenue'
                  : tousRelies
                    ? 'border-recup/40 text-recup'
                    : 'border-ambre/40 text-ambre',
              ].join(' ')}
            >
              {modules.length === 0 ? (
                'Vide'
              ) : tousRelies ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Interfaces reliees
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden /> Module isole
                </>
              )}
            </span>
          </div>

          {modules.length === 0 ? (
            <div className="grid place-items-center rounded-sm border border-dashed border-bordure py-12 text-center">
              <Building2 className="mb-2 h-8 w-8 text-bordure" aria-hidden />
              <p className="text-xs text-attenue">
                Ajoutez des modules pour assembler l usine.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {/* Rail d'assemblage MTP, chaque module se branche au suivant */}
              <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-wider text-attenue">
                <PastilleIndustrie id={industrie} />
                <span>bus MTP</span>
              </div>
              <AnimatePresence initial={false}>
                {modules.map((m, i) => {
                  const relie = compatibilite[i]
                  return (
                    <motion.div
                      key={m.id}
                      layout
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ duration: 0.2 }}
                    >
                      {i > 0 && (
                        <div className="ml-5 flex items-center gap-1.5 py-0.5 text-[10px]">
                          <Cable
                            className={relie ? 'h-3 w-3 text-recup' : 'h-3 w-3 text-ambre'}
                            aria-hidden
                          />
                          <span className={relie ? 'text-recup' : 'text-ambre'}>
                            {relie ? 'interface compatible' : 'pas d interface commune'}
                          </span>
                        </div>
                      )}
                      <div
                        className={[
                          'flex items-center justify-between gap-3 rounded-sm border bg-fond px-3 py-2',
                          relie ? 'border-bordure' : 'border-ambre/50',
                        ].join(' ')}
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm text-texte">{m.nom}</div>
                          <div className="compteur mt-0.5 text-[10px] text-attenue">
                            {m.signatureMTP}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => retirer(m.id)}
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-sm border border-bordure text-attenue hover:border-ambre/40 hover:text-ambre"
                          aria-label={`Retirer ${m.nom}`}
                        >
                          <X className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              <div className="mt-3 flex flex-wrap gap-3 border-t border-bordure pt-3 text-[11px] text-attenue">
                <span>
                  Modules <span className="compteur text-texte">{modules.length}</span>
                </span>
                <span>
                  Masse totale{' '}
                  <span className="compteur text-texte">
                    {modules.reduce((s, m) => s + m.masseKg, 0).toLocaleString('fr-FR')} kg
                  </span>
                </span>
                <span>
                  Valeur res.{' '}
                  <span className="compteur text-recup">
                    {modules
                      .reduce((s, m) => s + m.valeurResiduelle, 0)
                      .toLocaleString('fr-FR')}{' '}
                    eur
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-attenue">
        L indicateur de compatibilite verifie que chaque module partage au moins
        un jeton d interface MTP (fluide, electrique ou donnee) avec un autre
        module de l usine. Un module isole est signale en ambre.
      </p>
    </div>
  )
}

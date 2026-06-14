import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  PackageOpen,
  Scissors,
  Bot,
  Boxes,
  ScanSearch,
  CheckCircle2,
  Building2,
  Truck,
  AlertTriangle,
  Copy,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ParametresSimulation } from '../simulation/types'
import SectionTitre from './SectionTitre'

interface Etape {
  id: string
  nom: string
  icone: LucideIcon
  tempsBase: number // temps de cycle de reference, en unites illustratives
  automatisable: boolean // l'automatisation accelere ce poste
}

const etapes: Etape[] = [
  { id: 'reception', nom: 'Reception', icone: PackageOpen, tempsBase: 6, automatisable: false },
  { id: 'decoupe', nom: 'Decoupe', icone: Scissors, tempsBase: 10, automatisable: true },
  { id: 'soudage', nom: 'Soudage robotise', icone: Bot, tempsBase: 16, automatisable: true },
  { id: 'assemblagePea', nom: 'Assemblage des PEA', icone: Boxes, tempsBase: 14, automatisable: true },
  { id: 'cnd', nom: 'Controle non destructif', icone: ScanSearch, tempsBase: 9, automatisable: true },
  { id: 'test', nom: 'Test d acceptation', icone: CheckCircle2, tempsBase: 11, automatisable: false },
  { id: 'assemblageUsine', nom: 'Assemblage usine', icone: Building2, tempsBase: 18, automatisable: true },
  { id: 'expedition', nom: 'Expedition', icone: Truck, tempsBase: 7, automatisable: false },
]

interface Props {
  params: ParametresSimulation
}

// Vue 1, schema horizontal anime de la chaine de fabrication.
export default function FactoryLine({ params }: Props) {
  const { automatisation, taktHeures } = params

  // Temps de cycle effectif par poste, reduit par l'automatisation si le poste est automatisable.
  const calcule = useMemo(() => {
    const facteur = 1 - (automatisation / 100) * 0.6
    const tempsEffectifs = etapes.map((e) => ({
      ...e,
      temps: e.automatisable ? e.tempsBase * facteur : e.tempsBase,
    }))
    const tempsMax = Math.max(...tempsEffectifs.map((e) => e.temps))
    const goulotId = tempsEffectifs.find((e) => e.temps === tempsMax)?.id
    return { tempsEffectifs, tempsMax, goulotId }
  }, [automatisation])

  // Duree d'animation du flux par connecteur, plus courte si takt faible et automatisation forte.
  const dureeFlux = Math.min(
    3.2,
    Math.max(0.7, taktHeures * (1.1 - automatisation / 150) * 0.18),
  )

  // Cadence indicative, usines par jour de travail de 16 heures.
  const cadenceJour = (16 / Math.max(1, taktHeures)).toFixed(1)

  return (
    <div className="space-y-5">
      <SectionTitre
        titre="Chaine de fabrication"
        sous="Flux anime des postes, du brut a l usine expediee. Le rythme suit le takt et le niveau d automatisation."
      />

      <div className="flex flex-wrap gap-3">
        <Indicateur libelle="Takt" valeur={`${taktHeures} h`} accent="ambre" />
        <Indicateur libelle="Automatisation" valeur={`${automatisation} %`} accent="acier" />
        <Indicateur libelle="Cadence" valeur={`${cadenceJour} usines / jour`} accent="recup" />
        <Indicateur
          libelle="Poste goulot"
          valeur={etapes.find((e) => e.id === calcule.goulotId)?.nom ?? '-'}
          accent="ambre"
        />
      </div>

      <div className="panneau overflow-x-auto rounded-sm p-4 sm:p-6">
        <div className="flex min-w-max items-stretch gap-0">
          {calcule.tempsEffectifs.map((e, idx) => {
            const Icone = e.icone
            const estGoulot = e.id === calcule.goulotId
            const part = e.temps / calcule.tempsMax
            return (
              <div key={e.id} className="flex items-stretch">
                <div className="flex w-32 flex-col items-center text-center sm:w-36">
                  <div className="relative">
                    <motion.div
                      animate={{
                        boxShadow: estGoulot
                          ? [
                              '0 0 0px rgba(242,163,60,0.0)',
                              '0 0 16px rgba(242,163,60,0.55)',
                              '0 0 0px rgba(242,163,60,0.0)',
                            ]
                          : '0 0 0px rgba(0,0,0,0)',
                      }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className={[
                        'grid h-16 w-16 place-items-center rounded-sm border bg-fond',
                        estGoulot ? 'border-ambre' : 'border-bordure',
                      ].join(' ')}
                    >
                      <Icone
                        className={[
                          'h-7 w-7',
                          estGoulot ? 'text-ambre' : 'text-acier',
                        ].join(' ')}
                        aria-hidden
                      />
                    </motion.div>
                    {estGoulot && (
                      <span className="absolute -right-2 -top-2 flex items-center gap-1 rounded-sm border border-ambre/50 bg-fond px-1.5 py-0.5 text-[9px] font-semibold text-ambre">
                        <Copy className="h-2.5 w-2.5" aria-hidden />
                        x2
                      </span>
                    )}
                  </div>

                  <div className="mt-2 text-xs font-medium leading-tight text-texte">
                    {e.nom}
                  </div>

                  {/* Barre de charge relative du poste */}
                  <div className="mt-1.5 h-1 w-16 overflow-hidden rounded-full bg-bordure">
                    <div
                      className={estGoulot ? 'h-full bg-ambre' : 'h-full bg-acier'}
                      style={{ width: `${Math.round(part * 100)}%` }}
                    />
                  </div>
                  <div className="mt-1 compteur text-[10px] text-attenue">
                    {e.temps.toFixed(1)} u
                  </div>

                  {estGoulot && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-ambre">
                      <AlertTriangle className="h-3 w-3" aria-hidden />
                      redondance x2
                    </div>
                  )}
                </div>

                {/* Connecteur anime entre deux postes */}
                {idx < calcule.tempsEffectifs.length - 1 && (
                  <div className="flex w-10 items-center pb-16 sm:w-12">
                    <div className="relative h-0.5 w-full overflow-hidden rounded-full bg-bordure">
                      <motion.div
                        className="absolute top-0 h-0.5 w-6 rounded-full bg-gradient-to-r from-transparent via-ambre to-transparent"
                        animate={{ x: ['-24px', '60px'] }}
                        transition={{
                          duration: dureeFlux,
                          repeat: Infinity,
                          ease: 'linear',
                          delay: idx * (dureeFlux / 8),
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-attenue">
        Le poste goulot est mis en evidence en ambre. Sa redondance (x2) protege
        la cadence quand l automatisation deplace le goulot le long de la ligne.
        Reglez l automatisation et le takt depuis le tableau de bord de simulation.
      </p>
    </div>
  )
}

// Petite pastille d'indicateur en haut de la vue.
function Indicateur({
  libelle,
  valeur,
  accent,
}: {
  libelle: string
  valeur: string
  accent: 'ambre' | 'acier' | 'recup'
}) {
  const couleur =
    accent === 'ambre'
      ? 'text-ambre'
      : accent === 'acier'
        ? 'text-acier'
        : 'text-recup'
  return (
    <div className="panneau rounded-sm px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-attenue">
        {libelle}
      </div>
      <div className={['compteur text-sm font-semibold', couleur].join(' ')}>
        {valeur}
      </div>
    </div>
  )
}

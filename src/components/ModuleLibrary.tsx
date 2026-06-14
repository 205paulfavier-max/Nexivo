import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ScanLine, Weight, Recycle } from 'lucide-react'
import { modulesPEA } from '../data/modules'
import { industries } from '../data/industries'
import type { IndustrieId } from '../simulation/types'
import { BadgeDelai, BarreComposition, PastilleIndustrie } from './shared'
import SectionTitre from './SectionTitre'

interface Props {
  onPasseport: (id: string) => void
}

// Vue 2, catalogue des modules PEA en cartes, avec filtre par industrie.
export default function ModuleLibrary({ onPasseport }: Props) {
  const [filtre, setFiltre] = useState<IndustrieId | 'tous'>('tous')

  const liste = useMemo(
    () =>
      filtre === 'tous'
        ? modulesPEA
        : modulesPEA.filter((m) => m.industriesCompatibles.includes(filtre)),
    [filtre],
  )

  return (
    <div className="space-y-5">
      <SectionTitre
        titre="Bibliotheque de modules"
        sous="Catalogue des modules PEA disponibles, briques fonctionnelles natives MTP. Filtrez par industrie cible."
      />

      {/* Filtres par industrie */}
      <div className="flex flex-wrap gap-2">
        <BoutonFiltre actif={filtre === 'tous'} onClick={() => setFiltre('tous')}>
          Toutes industries
        </BoutonFiltre>
        {industries.map((i) => (
          <BoutonFiltre
            key={i.id}
            actif={filtre === i.id}
            onClick={() => setFiltre(i.id)}
          >
            {i.nom}
          </BoutonFiltre>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {liste.map((m, idx) => (
          <motion.article
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.03 }}
            className="panneau flex flex-col rounded-sm p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-sm font-semibold leading-snug text-texte">
                {m.nom}
              </h2>
              <BadgeDelai classe={m.classeDelai} />
            </div>

            <p className="mt-1.5 text-xs leading-relaxed text-attenue">
              {m.fonction}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {m.industriesCompatibles.map((id) => (
                <PastilleIndustrie key={id} id={id} />
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-attenue">
                <Weight className="h-3.5 w-3.5 text-acier" aria-hidden />
                Masse
                <span className="compteur text-texte">{m.masseKg} kg</span>
              </div>
              <div className="flex items-center gap-1.5 text-attenue">
                <Recycle className="h-3.5 w-3.5 text-recup" aria-hidden />
                Valeur res.
                <span className="compteur text-recup">
                  {m.valeurResiduelle.toLocaleString('fr-FR')} eur
                </span>
              </div>
            </div>

            <div className="mt-3">
              <div className="mb-1 text-[10px] uppercase tracking-wider text-attenue">
                Composition matiere
              </div>
              <BarreComposition composition={m.composition} />
            </div>

            <button
              type="button"
              onClick={() => onPasseport(m.id)}
              className="mt-4 flex items-center justify-center gap-2 rounded-sm border border-acier/40 bg-acier/10 px-3 py-1.5 text-xs font-medium text-acier transition-colors hover:bg-acier/20"
            >
              <ScanLine className="h-3.5 w-3.5" aria-hidden />
              Ouvrir le passeport numerique
            </button>
          </motion.article>
        ))}
      </div>
    </div>
  )
}

function BoutonFiltre({
  actif,
  onClick,
  children,
}: {
  actif: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-sm border px-3 py-1.5 text-xs transition-colors',
        actif
          ? 'border-ambre/40 bg-ambre/10 text-ambre'
          : 'border-bordure text-attenue hover:border-acier/40 hover:text-texte',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

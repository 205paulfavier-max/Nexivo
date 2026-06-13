import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Cpu,
  Boxes,
  Recycle,
  Coins,
  Weight,
  Wrench,
  Factory,
  Truck,
  RefreshCcw,
  Trash2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { modulesPEA, moduleParId } from '../data/modules'
import type { ModulePEA } from '../simulation/types'
import { valeurMatiereModule } from '../simulation/engine'
import { palette } from '../styles/tokens'
import { BadgeDelai, BarreComposition, PastilleIndustrie } from './shared'
import SectionTitre from './SectionTitre'

interface Props {
  moduleActifId: string | null
  setModuleActifId: (id: string) => void
}

// Vue 6, passeport numerique, jumeau numerique et historique d'un module.
export default function DigitalPassport({ moduleActifId, setModuleActifId }: Props) {
  const module = useMemo(
    () => moduleParId(moduleActifId ?? '') ?? modulesPEA[0],
    [moduleActifId],
  )

  return (
    <div className="space-y-5">
      <SectionTitre
        titre="Passeport numerique"
        sous="Jumeau numerique d un module, historique de cycle de vie, composition et destination de fin de vie."
      />

      {/* Selecteur de module */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-attenue">Module</span>
        <select
          value={module.id}
          onChange={(e) => setModuleActifId(e.target.value)}
          className="rounded-sm border border-bordure bg-surface px-3 py-1.5 text-sm text-texte outline-none focus:border-acier/60"
        >
          {modulesPEA.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nom}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Jumeau numerique */}
        <div className="panneau rounded-sm p-4 lg:col-span-1">
          <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-wider text-acier">
            <Cpu className="h-3.5 w-3.5" aria-hidden /> Jumeau numerique
          </div>
          <JumeauNumerique module={module} />
          <div className="mt-3 space-y-1">
            <div className="compteur text-[11px] text-attenue">id, {module.id}</div>
            <div className="compteur text-[11px] text-attenue">
              signature MTP, {module.signatureMTP}
            </div>
          </div>
        </div>

        {/* Donnees cles */}
        <div className="panneau space-y-4 rounded-sm p-4 lg:col-span-2">
          <div>
            <h2 className="text-base font-semibold text-texte">{module.nom}</h2>
            <p className="mt-1 text-xs leading-relaxed text-attenue">
              {module.fonction}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <BadgeDelai classe={module.classeDelai} />
            {module.industriesCompatibles.map((id) => (
              <PastilleIndustrie key={id} id={id} />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Donnee icone={Weight} libelle="Masse" valeur={`${module.masseKg} kg`} accent={palette.acier} />
            <Donnee
              icone={Coins}
              libelle="Valeur residuelle"
              valeur={`${module.valeurResiduelle.toLocaleString('fr-FR')} eur`}
              accent={palette.recup}
            />
            <Donnee
              icone={Recycle}
              libelle="Matiere recuperable"
              valeur={`${valeurMatiereModule(module).toLocaleString('fr-FR')} eur`}
              accent={palette.recup}
            />
          </div>

          <div>
            <div className="mb-1.5 text-[10px] uppercase tracking-wider text-attenue">
              Composition matiere
            </div>
            <BarreComposition composition={module.composition} legende />
          </div>

          <DestinationFinDeVie module={module} />
        </div>
      </div>

      {/* Historique de cycle de vie */}
      <div className="panneau rounded-sm p-4">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-texte">
          <Boxes className="h-4 w-4 text-ambre" aria-hidden />
          Historique de cycle de vie (illustratif)
        </h3>
        <Frise module={module} />
      </div>
    </div>
  )
}

// Representation stylisee du jumeau numerique du module.
function JumeauNumerique({ module }: { module: ModulePEA }) {
  // Pseudo code matriciel deterministe, derive du nom du module.
  const cellules = useMemo(() => {
    const graine = module.id.split('').reduce((s, c) => s + c.charCodeAt(0), 0)
    return Array.from({ length: 36 }, (_, i) => ((graine * (i + 7)) % 5) > 1)
  }, [module.id])

  return (
    <div className="grid place-items-center rounded-sm border border-bordure bg-fond p-4">
      <svg viewBox="0 0 120 120" className="h-40 w-40">
        <rect x="14" y="20" width="92" height="64" rx="3" fill="none" stroke={palette.acier} strokeWidth="2" />
        <rect x="24" y="30" width="32" height="44" rx="2" fill={palette.surface} stroke={palette.bordure} />
        <rect x="64" y="30" width="32" height="20" rx="2" fill={palette.surface} stroke={palette.bordure} />
        <rect x="64" y="54" width="32" height="20" rx="2" fill={palette.surface} stroke={palette.bordure} />
        {/* Connexions MTP animees */}
        {[36, 50, 64].map((y, i) => (
          <line key={i} x1="56" y1={y} x2="64" y2={y} stroke={palette.ambre} strokeWidth="1.5">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </line>
        ))}
        <circle cx="40" cy="52" r="6" fill="none" stroke={palette.ambre} strokeWidth="1.5">
          <animate attributeName="r" values="5;7;5" dur="2.4s" repeatCount="indefinite" />
        </circle>
      </svg>
      {/* Pseudo passeport matriciel */}
      <div className="mt-2 grid grid-cols-6 gap-0.5">
        {cellules.map((on, i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-[1px]"
            style={{ backgroundColor: on ? palette.texte : palette.bordure }}
          />
        ))}
      </div>
    </div>
  )
}

// Determine une destination de fin de vie selon la composition.
function DestinationFinDeVie({ module }: { module: ModulePEA }) {
  const c = module.composition
  const metaux = c.acier + c.inox + c.cuivre
  let texte: string
  if (c.electronique >= 30) {
    texte =
      'Reconditionnement prioritaire de l electronique, puis filiere DEEE pour les cartes en fin de vie.'
  } else if (metaux >= 70) {
    texte =
      'Reemploi du chassis si l etat le permet, sinon refonte des metaux (acier, inox, cuivre).'
  } else {
    texte =
      'Tri par materiau, reemploi des sous ensembles sains, recyclage matiere pour le reste.'
  }
  return (
    <div className="rounded-sm border border-recup/30 bg-recup/5 p-3">
      <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-wider text-recup">
        <Recycle className="h-3.5 w-3.5" aria-hidden /> Destination de fin de vie
      </div>
      <p className="text-xs leading-relaxed text-texte">{texte}</p>
    </div>
  )
}

interface Evenement {
  icone: LucideIcon
  phase: string
  detail: string
  couleur: string
}

// Frise d'evenements illustratifs du cycle de vie.
function Frise({ module }: { module: ModulePEA }) {
  const evenements: Evenement[] = useMemo(() => {
    const delaiMois =
      module.classeDelai === 'long' ? 14 : module.classeDelai === 'moyen' ? 9 : 5
    return [
      { icone: Factory, phase: 'Fabrication', detail: `Produit et teste, delai ${module.classeDelai}`, couleur: palette.ambre },
      { icone: Truck, phase: 'Mise en service', detail: 'Branchement MTP et exploitation', couleur: palette.acier },
      { icone: Wrench, phase: 'Maintenance par echange', detail: `Premier echange vers ${delaiMois} mois`, couleur: palette.acier },
      { icone: RefreshCcw, phase: 'Reconditionnement', detail: 'Retour atelier, controle et remise a niveau', couleur: palette.recup },
      { icone: Recycle, phase: 'Reemploi', detail: 'Retour a l approvisionnement pour une nouvelle usine', couleur: palette.recup },
      { icone: Trash2, phase: 'Fin de vie', detail: `Valeur matiere ${valeurMatiereModule(module).toLocaleString('fr-FR')} eur`, couleur: palette.attenue },
    ]
  }, [module])

  return (
    <ol className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {evenements.map((e, i) => {
        const Icone = e.icone
        return (
          <motion.li
            key={e.phase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            className="flex items-start gap-3 rounded-sm border border-bordure bg-fond p-3"
          >
            <div
              className="grid h-8 w-8 shrink-0 place-items-center rounded-sm border"
              style={{ borderColor: `${e.couleur}66` }}
            >
              <Icone className="h-4 w-4" style={{ color: e.couleur }} aria-hidden />
            </div>
            <div>
              <div className="text-xs font-semibold text-texte">{e.phase}</div>
              <div className="mt-0.5 text-[11px] leading-snug text-attenue">
                {e.detail}
              </div>
            </div>
          </motion.li>
        )
      })}
    </ol>
  )
}

function Donnee({
  icone: Icone,
  libelle,
  valeur,
  accent,
}: {
  icone: LucideIcon
  libelle: string
  valeur: string
  accent: string
}) {
  return (
    <div className="rounded-sm border border-bordure bg-fond p-2.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-attenue">
        <Icone className="h-3.5 w-3.5" aria-hidden />
        {libelle}
      </div>
      <div className="compteur mt-1 text-sm font-semibold" style={{ color: accent }}>
        {valeur}
      </div>
    </div>
  )
}

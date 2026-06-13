import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import {
  Gauge,
  Clock,
  CheckCircle2,
  RefreshCcw,
  Users,
  Recycle,
  Coins,
} from 'lucide-react'
import type {
  ParametresSimulation,
  UsineModulaire,
} from '../simulation/types'
import { agregerModules, simuler } from '../simulation/engine'
import { palette } from '../styles/tokens'
import SectionTitre from './SectionTitre'

interface Props {
  params: ParametresSimulation
  setParams: (p: ParametresSimulation) => void
  usine: UsineModulaire | null
}

// Vue 5, tableau de bord, curseurs et calcul en direct des indicateurs.
export default function SimulationDashboard({ params, setParams, usine }: Props) {
  // Contexte derive de l'usine configuree, sinon usine de reference.
  const ctx = useMemo(() => agregerModules(usine?.modules ?? []), [usine])

  const res = useMemo(() => simuler(params, ctx), [params, ctx])

  const set = (cle: keyof ParametresSimulation, valeur: number | boolean) =>
    setParams({ ...params, [cle]: valeur })

  // Balayage de l'automatisation pour montrer son effet sur les indicateurs.
  const balayage = useMemo(() => {
    return Array.from({ length: 11 }, (_, i) => {
      const a = i * 10
      const r = simuler({ ...params, automatisation: a }, ctx)
      return {
        automatisation: a,
        delai: r.delaiSemaines,
        rendement: r.rendementPremierPassage,
        mainOeuvre: r.heuresMainOeuvre,
      }
    })
  }, [params, ctx])

  // Donnees du graphique en barres des indicateurs en pourcentage.
  const barres = [
    { nom: 'OTIF', valeur: res.livraisonOTIF },
    { nom: 'Rendement', valeur: res.rendementPremierPassage },
    { nom: 'Reprise', valeur: res.tauxReprise },
    { nom: 'Reemploi', valeur: res.reemploiEffectif },
  ]

  return (
    <div className="space-y-5">
      <SectionTitre
        titre="Tableau de bord de simulation"
        sous="Reglez les parametres et observez l effet en direct sur les indicateurs. Coeur de la demonstration."
      />

      {usine && (
        <div className="panneau rounded-sm px-3 py-2 text-xs text-attenue">
          Usine prise en compte,{' '}
          <span className="text-texte">{usine.nom}</span>, {ctx.nbModules} modules,
          part de modules a delai long{' '}
          <span className="compteur text-ambre">
            {Math.round(ctx.partLong * 100)} %
          </span>
          .
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Curseurs */}
        <div className="panneau space-y-5 rounded-sm p-4 lg:col-span-1">
          <h2 className="text-sm font-semibold text-texte">Parametres</h2>

          <Curseur
            libelle="Niveau d automatisation"
            valeur={params.automatisation}
            unite=" %"
            onChange={(v) => set('automatisation', v)}
          />
          <Curseur
            libelle="Taille du tampon"
            valeur={params.tampon}
            unite=" %"
            onChange={(v) => set('tampon', v)}
          />
          <Curseur
            libelle="Taux de reemploi vise"
            valeur={params.reemploi}
            unite=" %"
            onChange={(v) => set('reemploi', v)}
          />
          <Curseur
            libelle="Takt"
            valeur={params.taktHeures}
            min={2}
            max={24}
            unite=" h"
            onChange={(v) => set('taktHeures', v)}
          />

          {/* Bascule double sourcing */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-attenue">Double sourcing</span>
            <button
              type="button"
              onClick={() => set('doubleSourcing', !params.doubleSourcing)}
              className={[
                'relative h-6 w-11 rounded-full border transition-colors',
                params.doubleSourcing
                  ? 'border-recup/50 bg-recup/30'
                  : 'border-bordure bg-fond',
              ].join(' ')}
              aria-pressed={params.doubleSourcing}
            >
              <motion.span
                layout
                className={[
                  'absolute top-0.5 h-4 w-4 rounded-full',
                  params.doubleSourcing ? 'right-0.5 bg-recup' : 'left-0.5 bg-attenue',
                ].join(' ')}
              />
            </button>
          </div>
        </div>

        {/* Compteurs d'indicateurs */}
        <div className="grid grid-cols-2 gap-3 lg:col-span-2 xl:grid-cols-3">
          <Compteur
            icone={Gauge}
            libelle="Livraison OTIF"
            valeur={res.livraisonOTIF}
            unite="%"
            accent={palette.acier}
          />
          <Compteur
            icone={Clock}
            libelle="Delai moyen"
            valeur={res.delaiSemaines}
            unite="sem"
            accent={palette.ambre}
          />
          <Compteur
            icone={CheckCircle2}
            libelle="Rendement 1er passage"
            valeur={res.rendementPremierPassage}
            unite="%"
            accent={palette.acier}
          />
          <Compteur
            icone={RefreshCcw}
            libelle="Taux de reprise"
            valeur={res.tauxReprise}
            unite="%"
            accent={palette.recup}
          />
          <Compteur
            icone={Users}
            libelle="Main d oeuvre"
            valeur={res.heuresMainOeuvre}
            unite="h / usine"
            accent={palette.ambre}
          />
          <Compteur
            icone={Recycle}
            libelle="Reemploi effectif"
            valeur={res.reemploiEffectif}
            unite="%"
            accent={palette.recup}
          />
          <Compteur
            icone={Coins}
            libelle="Matiere recuperee"
            valeur={res.valeurMatiereRecuperee}
            unite="eur"
            accent={palette.recup}
            large
          />
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="panneau rounded-sm p-4">
          <h3 className="mb-3 text-sm font-semibold text-texte">
            Indicateurs en pourcentage
          </h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barres} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={palette.bordure} />
                <XAxis dataKey="nom" tick={{ fill: palette.attenue, fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: palette.attenue, fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: palette.surface,
                    border: `1px solid ${palette.bordure}`,
                    borderRadius: 2,
                    color: palette.texte,
                    fontSize: 12,
                  }}
                  cursor={{ fill: 'rgba(63,182,201,0.08)' }}
                />
                <Bar dataKey="valeur" fill={palette.acier} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panneau rounded-sm p-4">
          <h3 className="mb-3 text-sm font-semibold text-texte">
            Effet de l automatisation, balayage de 0 a 100 %
          </h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={balayage} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={palette.bordure} />
                <XAxis
                  dataKey="automatisation"
                  tick={{ fill: palette.attenue, fontSize: 11 }}
                  unit=" %"
                />
                <YAxis tick={{ fill: palette.attenue, fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: palette.surface,
                    border: `1px solid ${palette.bordure}`,
                    borderRadius: 2,
                    color: palette.texte,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: palette.attenue }} />
                <Line
                  type="monotone"
                  dataKey="delai"
                  name="Delai (sem)"
                  stroke={palette.ambre}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="rendement"
                  name="Rendement (%)"
                  stroke={palette.acier}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <p className="text-xs text-attenue">
        Relations illustratives. Augmentez l automatisation pour voir le delai et
        la main d oeuvre baisser, le tampon et le double sourcing pour soutenir l
        OTIF, le reemploi pour faire monter la reprise et la valeur matiere recuperee.
      </p>
    </div>
  )
}

// Curseur de parametre.
function Curseur({
  libelle,
  valeur,
  onChange,
  min = 0,
  max = 100,
  unite = '',
}: {
  libelle: string
  valeur: number
  onChange: (v: number) => void
  min?: number
  max?: number
  unite?: string
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs text-attenue">{libelle}</label>
        <span className="compteur text-xs font-semibold text-texte">
          {valeur}
          {unite}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={valeur}
        onChange={(e) => onChange(Number(e.target.value))}
        className="curseur"
      />
    </div>
  )
}

// Compteur d'indicateur, valeur en monospace mise a jour en direct.
function Compteur({
  icone: Icone,
  libelle,
  valeur,
  unite,
  accent,
  large = false,
}: {
  icone: React.ComponentType<{ className?: string }>
  libelle: string
  valeur: number
  unite: string
  accent: string
  large?: boolean
}) {
  return (
    <div className={['panneau rounded-sm p-3', large ? 'col-span-2 xl:col-span-1' : ''].join(' ')}>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-attenue">
        <Icone className="h-3.5 w-3.5" />
        {libelle}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <motion.span
          key={valeur}
          initial={{ opacity: 0.4, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="compteur text-xl font-bold"
          style={{ color: accent }}
        >
          {valeur.toLocaleString('fr-FR')}
        </motion.span>
        <span className="text-[11px] text-attenue">{unite}</span>
      </div>
    </div>
  )
}

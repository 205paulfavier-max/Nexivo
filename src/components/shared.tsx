import type { ClasseDelai, CompositionMatiere, IndustrieId } from '../simulation/types'
import { nomIndustrie } from '../data/industries'
import { couleurIndustrie } from '../styles/tokens'

// Pastille coloree representant une industrie.
export function PastilleIndustrie({ id }: { id: IndustrieId }) {
  const couleur = couleurIndustrie[id] ?? '#8A95A3'
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px]"
      style={{ borderColor: `${couleur}55`, color: couleur }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: couleur }}
      />
      {nomIndustrie(id)}
    </span>
  )
}

// Libelles et couleurs des classes de delai.
const delaiInfos: Record<ClasseDelai, { libelle: string; classe: string }> = {
  court: { libelle: 'Delai court', classe: 'text-recup border-recup/40' },
  moyen: { libelle: 'Delai moyen', classe: 'text-acier border-acier/40' },
  long: { libelle: 'Delai long', classe: 'text-ambre border-ambre/40' },
}

// Etiquette de classe de delai.
export function BadgeDelai({ classe }: { classe: ClasseDelai }) {
  const info = delaiInfos[classe]
  return (
    <span
      className={[
        'inline-block rounded-sm border px-2 py-0.5 text-[11px] font-medium',
        info.classe,
      ].join(' ')}
    >
      {info.libelle}
    </span>
  )
}

// Couleurs par materiau, pour la barre de composition.
export const couleurMatiere: Record<keyof CompositionMatiere, string> = {
  acier: '#6B7785',
  inox: '#9FB0C0',
  cuivre: '#C97B3F',
  electronique: '#3FB6C9',
  autre: '#4B5563',
}

const libelleMatiere: Record<keyof CompositionMatiere, string> = {
  acier: 'Acier',
  inox: 'Inox',
  cuivre: 'Cuivre',
  electronique: 'Electronique',
  autre: 'Autre',
}

// Barre empilee de composition matiere, avec legende optionnelle.
export function BarreComposition({
  composition,
  legende = false,
}: {
  composition: CompositionMatiere
  legende?: boolean
}) {
  const cles = Object.keys(composition) as (keyof CompositionMatiere)[]
  return (
    <div className="space-y-2">
      <div className="flex h-2.5 w-full overflow-hidden rounded-sm border border-bordure">
        {cles.map((k) => (
          <div
            key={k}
            style={{
              width: `${composition[k]}%`,
              backgroundColor: couleurMatiere[k],
            }}
            title={`${libelleMatiere[k]} ${composition[k]} %`}
          />
        ))}
      </div>
      {legende && (
        <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-attenue">
          {cles.map((k) => (
            <li key={k} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: couleurMatiere[k] }}
              />
              {libelleMatiere[k]}
              <span className="compteur text-texte">{composition[k]} %</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

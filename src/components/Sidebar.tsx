import {
  Factory,
  LayoutGrid,
  Settings2,
  RefreshCw,
  SlidersHorizontal,
  ScanLine,
  type LucideIcon,
} from 'lucide-react'

// Identifiants des six vues de l'application.
export type VueId =
  | 'chaine'
  | 'bibliotheque'
  | 'configurateur'
  | 'cycle'
  | 'simulation'
  | 'passeport'

interface ItemNav {
  id: VueId
  libelle: string
  icone: LucideIcon
}

const items: ItemNav[] = [
  { id: 'chaine', libelle: 'Chaine de fabrication', icone: Factory },
  { id: 'bibliotheque', libelle: 'Bibliotheque de modules', icone: LayoutGrid },
  { id: 'configurateur', libelle: 'Configurateur d usine', icone: Settings2 },
  { id: 'cycle', libelle: 'Boucle de cycle de vie', icone: RefreshCw },
  { id: 'simulation', libelle: 'Tableau de bord', icone: SlidersHorizontal },
  { id: 'passeport', libelle: 'Passeport numerique', icone: ScanLine },
]

interface Props {
  vue: VueId
  setVue: (v: VueId) => void
}

// Navigation laterale sur desktop, barre superieure defilable sur mobile.
export default function Sidebar({ vue, setVue }: Props) {
  return (
    <nav className="z-10 shrink-0 border-bordure bg-surface md:w-64 md:border-r">
      <div className="flex items-center gap-3 border-b border-bordure px-4 py-4">
        <div className="grid h-9 w-9 place-items-center rounded-sm bg-fond ring-1 ring-bordure">
          <Factory className="h-5 w-5 text-ambre" aria-hidden />
        </div>
        <div className="leading-tight">
          <div className="font-mono text-sm font-bold tracking-widest text-texte">
            GENESIS
          </div>
          <div className="text-[10px] uppercase tracking-wider text-attenue">
            Fabrique d usines
          </div>
        </div>
      </div>

      <ul className="flex gap-1 overflow-x-auto p-2 md:flex-col md:overflow-visible">
        {items.map((item) => {
          const actif = vue === item.id
          const Icone = item.icone
          return (
            <li key={item.id} className="shrink-0 md:shrink">
              <button
                type="button"
                onClick={() => setVue(item.id)}
                aria-current={actif ? 'page' : undefined}
                className={[
                  'flex w-full items-center gap-2.5 whitespace-nowrap rounded-sm border px-3 py-2 text-left text-sm transition-colors',
                  actif
                    ? 'border-ambre/40 bg-ambre/10 text-texte'
                    : 'border-transparent text-attenue hover:border-bordure hover:bg-fond hover:text-texte',
                ].join(' ')}
              >
                <Icone
                  className={['h-4 w-4 shrink-0', actif ? 'text-ambre' : ''].join(
                    ' ',
                  )}
                  aria-hidden
                />
                <span className="md:inline">{item.libelle}</span>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="hidden px-4 py-4 text-[11px] leading-relaxed text-attenue md:block">
        Usine native du standard MTP, circulaire de la conception au recyclage.
      </div>
    </nav>
  )
}

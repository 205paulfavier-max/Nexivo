import { Info } from 'lucide-react'

// Avertissement discret, rappelle le caractere illustratif des donnees.
export default function Disclaimer() {
  return (
    <div className="flex items-center gap-2 border-b border-bordure bg-surface/60 px-4 py-1.5 text-[11px] text-attenue sm:px-6 lg:px-8">
      <Info className="h-3.5 w-3.5 shrink-0 text-acier" aria-hidden />
      <span>
        Modele de demonstration. Les parametres et indicateurs sont illustratifs
        et configurables, ce ne sont pas des donnees d ingenierie validees.
      </span>
    </div>
  )
}

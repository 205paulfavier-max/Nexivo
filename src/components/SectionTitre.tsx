// Titre de section reutilisable, avec un sous titre optionnel.
export default function SectionTitre({
  titre,
  sous,
}: {
  titre: string
  sous?: string
}) {
  return (
    <header className="space-y-1">
      <h1 className="text-lg font-semibold tracking-tight text-texte sm:text-xl">
        {titre}
      </h1>
      {sous && <p className="max-w-3xl text-sm text-attenue">{sous}</p>}
    </header>
  )
}

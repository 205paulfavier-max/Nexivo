import { useMemo } from 'react'
import { palette } from '../styles/tokens'
import SectionTitre from './SectionTitre'

interface Props {
  reemploi: number // 0 a 100, met en evidence le flux de reemploi
}

// Etapes du cycle de vie, placees autour de l'anneau dans l'ordre du flux.
const etapes = [
  'Conception',
  'Fabrication',
  'Approvisionnement',
  'Assemblage',
  'Exploitation',
  'Maintenance par echange',
  'Fin de vie',
  'Reconditionnement',
]

const CX = 220
const CY = 220
const R = 160

// Position d'un noeud sur l'anneau, angle en partant du haut, sens horaire.
function positionNoeud(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2
  return { x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle), angle }
}

// Vue 4, boucle de cycle de vie, schema circulaire anime.
export default function LifecycleLoop({ reemploi }: Props) {
  const noeuds = useMemo(
    () => etapes.map((nom, i) => ({ nom, ...positionNoeud(i, etapes.length) })),
    [],
  )

  // Chemin circulaire pour l'animation du flux principal.
  const cheminAnneau = `M ${CX},${CY - R} a ${R},${R} 0 1,1 0,${2 * R} a ${R},${R} 0 1,1 0,${-2 * R}`

  // Reconditionnement (index 7) revient vers Approvisionnement (index 2).
  const recond = noeuds[7]
  const appro = noeuds[2]
  const finVie = noeuds[6]

  // Intensite du flux de reemploi, pilotee par le parametre.
  const intensite = 0.25 + (reemploi / 100) * 0.75
  const nbDotsReemploi = reemploi >= 66 ? 3 : reemploi >= 33 ? 2 : 1

  return (
    <div className="space-y-5">
      <SectionTitre
        titre="Boucle de cycle de vie"
        sous="De la conception au recyclage. La maintenance se fait par echange de modules, le reconditionnement renvoie vers l approvisionnement, le flux de reemploi est en vert."
      />

      <div className="flex flex-wrap items-center gap-3">
        <Legende couleur={palette.acier} texte="Flux principal du cycle" />
        <Legende couleur={palette.recup} texte="Flux de reemploi et reconditionnement" />
        <Legende couleur={palette.attenue} texte="Recyclage matiere en sortie" />
        <span className="panneau rounded-sm px-3 py-1.5 text-[11px] text-attenue">
          Taux de reemploi vise{' '}
          <span className="compteur text-recup">{reemploi} %</span>
        </span>
      </div>

      <div className="panneau grid place-items-center rounded-sm p-4">
        <svg
          viewBox="0 0 440 440"
          className="h-auto w-full max-w-[520px]"
          role="img"
          aria-label="Schema circulaire du cycle de vie GENESIS"
        >
          {/* Anneau de base */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={palette.bordure}
            strokeWidth={2}
          />
          {/* Trace lumineux du flux principal */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={palette.acier}
            strokeWidth={2}
            strokeDasharray="6 14"
            opacity={0.7}
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-200"
              dur="6s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Dots du flux principal, animes le long de l'anneau */}
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} r={4} fill={palette.acier}>
              <animateMotion
                dur="9s"
                repeatCount="indefinite"
                begin={`${(i * 9) / 4}s`}
                path={cheminAnneau}
                rotate="auto"
              />
            </circle>
          ))}

          {/* Arc de reemploi, du reconditionnement vers l'approvisionnement, en vert */}
          <path
            d={`M ${recond.x},${recond.y} Q ${CX},${CY} ${appro.x},${appro.y}`}
            fill="none"
            stroke={palette.recup}
            strokeWidth={2.5}
            opacity={intensite}
            strokeDasharray="5 9"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-140"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
          {Array.from({ length: nbDotsReemploi }).map((_, i) => (
            <circle key={`re-${i}`} r={4.5} fill={palette.recup} opacity={intensite}>
              <animateMotion
                dur="3.4s"
                repeatCount="indefinite"
                begin={`${(i * 3.4) / nbDotsReemploi}s`}
                path={`M ${recond.x},${recond.y} Q ${CX},${CY} ${appro.x},${appro.y}`}
              />
            </circle>
          ))}

          {/* Sortie de recyclage matiere, depuis la fin de vie vers l'exterieur */}
          {(() => {
            const dx = (finVie.x - CX) / R
            const dy = (finVie.y - CY) / R
            const ex = finVie.x + dx * 48
            const ey = finVie.y + dy * 48
            return (
              <g>
                <line
                  x1={finVie.x}
                  y1={finVie.y}
                  x2={ex}
                  y2={ey}
                  stroke={palette.attenue}
                  strokeWidth={2}
                  strokeDasharray="4 6"
                />
                <circle r={3.5} fill={palette.attenue}>
                  <animateMotion
                    dur="2.4s"
                    repeatCount="indefinite"
                    path={`M ${finVie.x},${finVie.y} L ${ex},${ey}`}
                  />
                </circle>
                <text
                  x={ex}
                  y={ey + 14}
                  textAnchor="middle"
                  fontSize="9"
                  fill={palette.attenue}
                >
                  Recyclage matiere
                </text>
              </g>
            )
          })()}

          {/* Noeuds des etapes */}
          {noeuds.map((n, i) => {
            const estReemploi = i === 5 || i === 6 || i === 7 // maintenance, fin de vie, reconditionnement
            const couleur = estReemploi ? palette.recup : palette.ambre
            // Decalage du texte vers l'exterieur du cercle.
            const dx = (n.x - CX) / R
            const dy = (n.y - CY) / R
            const tx = n.x + dx * 26
            const ty = n.y + dy * 26
            const ancrage = dx > 0.3 ? 'start' : dx < -0.3 ? 'end' : 'middle'
            return (
              <g key={n.nom}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={7}
                  fill={palette.fond}
                  stroke={couleur}
                  strokeWidth={2.5}
                />
                <circle cx={n.x} cy={n.y} r={2.5} fill={couleur} />
                <text
                  x={tx}
                  y={ty}
                  textAnchor={ancrage}
                  dominantBaseline="middle"
                  fontSize="10.5"
                  fontWeight={600}
                  fill={palette.texte}
                >
                  {n.nom}
                </text>
              </g>
            )
          })}

          {/* Coeur de l'anneau */}
          <text
            x={CX}
            y={CY - 8}
            textAnchor="middle"
            fontSize="13"
            fontWeight={700}
            fill={palette.texte}
            style={{ letterSpacing: '0.15em' }}
          >
            GENESIS
          </text>
          <text
            x={CX}
            y={CY + 10}
            textAnchor="middle"
            fontSize="9"
            fill={palette.attenue}
          >
            economie circulaire
          </text>
        </svg>
      </div>

      <p className="text-xs text-attenue">
        La maintenance par echange remplace un module sans arreter l usine. Le
        module depose part en reconditionnement puis revient a l approvisionnement,
        c est le flux de reemploi (en vert). Ce qui ne peut etre reemploye sort
        en recyclage matiere. Reglez le taux de reemploi depuis le tableau de bord.
      </p>
    </div>
  )
}

function Legende({ couleur, texte }: { couleur: string; texte: string }) {
  return (
    <span className="flex items-center gap-2 text-[11px] text-attenue">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: couleur }}
      />
      {texte}
    </span>
  )
}

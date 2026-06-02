import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Scene as SceneData } from "../data/script";
import { Background } from "./Background";
import { Visual } from "./Visual";
import { Caption } from "./Caption";
import { ChapterLabel } from "./ChapterLabel";

/**
 * Rend une séquence complète :
 *  - fond animé selon le ton,
 *  - couche visuelle (regroupée par plans pour ne pas relancer l'animation
 *    à chaque sous-titre qui partage le même visuel),
 *  - couche sous-titres,
 *  - étiquette de chapitre au début.
 */
export const Scene: React.FC<{ scene: SceneData; showChapter?: boolean }> = ({
  scene,
  showChapter = true,
}) => {
  const { fps } = useVideoConfig();

  // Durées en frames + offsets cumulés.
  const durations = scene.captions.map((c) => Math.round(c.seconds * fps));
  const offsets: number[] = [];
  durations.reduce((acc, d, i) => {
    offsets[i] = acc;
    return acc + d;
  }, 0);

  // Regroupe les sous-titres consécutifs qui partagent le même visuel.
  type Run = { visual: string; from: number; frames: number };
  const runs: Run[] = [];
  scene.captions.forEach((c, i) => {
    const last = runs[runs.length - 1];
    if (last && last.visual === c.visual) {
      last.frames += durations[i];
    } else {
      runs.push({ visual: c.visual, from: offsets[i], frames: durations[i] });
    }
  });

  return (
    <AbsoluteFill>
      <Background tone={scene.tone} />

      {/* Couche visuelle */}
      {runs.map((run, i) => (
        <Sequence key={i} from={run.from} durationInFrames={run.frames}>
          <Visual kind={run.visual as never} />
        </Sequence>
      ))}

      {/* Couche sous-titres. La carte titre ("title") porte déjà son propre
          texte : on n'affiche pas de sous-titre redondant par-dessus. */}
      {scene.captions.map((c, i) =>
        c.visual === "title" ? null : (
          <Sequence key={i} from={offsets[i]} durationInFrames={durations[i]}>
            <Caption
              text={c.text}
              durationInFrames={durations[i]}
              emphasis={c.emphasis}
              source={c.source}
            />
          </Sequence>
        ),
      )}

      {/* Étiquette de chapitre (sauf accroche / titre). */}
      {showChapter && scene.number > 0 ? (
        <Sequence from={0} durationInFrames={Math.round(3.2 * fps)}>
          <ChapterLabel number={scene.number} title={scene.title} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};

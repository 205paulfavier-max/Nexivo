import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { scenes } from "./data/script";
import { Scene } from "./components/Scene";
import { sceneFrames, TRANSITION_FRAMES } from "./timing";
import { colors } from "./data/theme";
import { loadFonts } from "./fonts";

// Chargement des polices locales (hors-ligne, fiable au rendu).
loadFonts();

export type MitsubishiVideoProps = {
  /**
   * Nom du fichier voix-off déposé dans /public (ex. "voix-off.mp3").
   * Laisser vide tant que la voix n'est pas enregistrée.
   */
  voiceoverFile?: string;
  /** Fichier musique d'ambiance dans /public (optionnel). */
  musicFile?: string;
};

export const MitsubishiVideo: React.FC<MitsubishiVideoProps> = ({
  voiceoverFile,
  musicFile,
}) => {
  const frames = sceneFrames();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bgDarker }}>
      <TransitionSeries>
        {scenes.map((scene, i) => (
          <React.Fragment key={scene.id}>
            <TransitionSeries.Sequence durationInFrames={frames[i]}>
              <Scene scene={scene} />
            </TransitionSeries.Sequence>
            {i < scenes.length - 1 ? (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            ) : null}
          </React.Fragment>
        ))}
      </TransitionSeries>

      {/* Piste voix-off : se branchera automatiquement dès qu'un fichier est fourni. */}
      {voiceoverFile ? <Audio src={staticFile(voiceoverFile)} /> : null}

      {/* Musique d'ambiance optionnelle, en sourdine. */}
      {musicFile ? <Audio src={staticFile(musicFile)} volume={0.18} /> : null}
    </AbsoluteFill>
  );
};

import { scenes } from "./data/script";
import { FPS } from "./data/theme";

/** Frames de fondu enchaîné entre deux séquences. */
export const TRANSITION_FRAMES = 18;

/** Durée (en frames) de chaque séquence = somme de ses sous-titres. */
export const sceneFrames = (fps: number = FPS): number[] =>
  scenes.map((scene) =>
    scene.captions.reduce((acc, c) => acc + Math.round(c.seconds * fps), 0),
  );

/**
 * Durée totale de la vidéo en frames, en tenant compte des fondus
 * (TransitionSeries fait chevaucher les séquences de TRANSITION_FRAMES).
 */
export const totalFrames = (fps: number = FPS): number => {
  const frames = sceneFrames(fps);
  const sum = frames.reduce((a, b) => a + b, 0);
  const overlaps = (frames.length - 1) * TRANSITION_FRAMES;
  return sum - overlaps;
};

import { scenes, Scene } from "./data/script";
import { FPS } from "./data/theme";

/** Frames de fondu enchaîné entre deux séquences. */
export const TRANSITION_FRAMES = 18;

/**
 * Durées (en frames) de chaque sous-titre d'une séquence.
 *
 * Si la séquence a un `targetSeconds`, les `seconds` des sous-titres sont
 * traités comme des POIDS relatifs et mis à l'échelle pour que la séquence
 * dure exactement `targetSeconds`. Sinon, on convertit directement
 * `seconds` -> frames.
 */
export const captionFrames = (scene: Scene, fps: number = FPS): number[] => {
  const weights = scene.captions.map((c) => c.seconds);

  if (scene.targetSeconds) {
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const targetFrames = Math.round(scene.targetSeconds * fps);
    // Répartition proportionnelle, en gardant la somme exacte = targetFrames.
    const raw = weights.map((w) => (w / totalWeight) * targetFrames);
    const floored = raw.map((r) => Math.floor(r));
    let remainder = targetFrames - floored.reduce((a, b) => a + b, 0);
    // On distribue les frames restantes aux plus grosses parties fractionnaires.
    const order = raw
      .map((r, i) => ({ i, frac: r - Math.floor(r) }))
      .sort((a, b) => b.frac - a.frac);
    const result = [...floored];
    for (let k = 0; k < remainder; k++) {
      result[order[k % order.length].i] += 1;
    }
    return result;
  }

  return weights.map((s) => Math.round(s * fps));
};

/** Durée (en frames) de chaque séquence = somme de ses sous-titres. */
export const sceneFrames = (fps: number = FPS): number[] =>
  scenes.map((scene) => captionFrames(scene, fps).reduce((a, b) => a + b, 0));

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

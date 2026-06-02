import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/**
 * Chargement des polices EN LOCAL (fichiers dans public/fonts).
 * On évite volontairement le chargement réseau de Google Fonts :
 * dans l'environnement de rendu, le navigateur headless ne fait pas
 * confiance au certificat du proxy et le téléchargement échoue.
 *
 * Les .ttf sont déjà inclus dans le dépôt, donc le rendu est 100 % hors-ligne.
 */

let started = false;

export const loadFonts = () => {
  if (started) return;
  started = true;

  // Montserrat (titres)
  loadFont({ family: "Montserrat", url: staticFile("fonts/montserrat-500.ttf"), weight: "500" });
  loadFont({ family: "Montserrat", url: staticFile("fonts/montserrat-700.ttf"), weight: "700" });
  loadFont({ family: "Montserrat", url: staticFile("fonts/montserrat-800.ttf"), weight: "800" });
  loadFont({ family: "Montserrat", url: staticFile("fonts/montserrat-900.ttf"), weight: "900" });

  // Inter (corps de texte)
  loadFont({ family: "Inter", url: staticFile("fonts/inter-400.ttf"), weight: "400" });
  loadFont({ family: "Inter", url: staticFile("fonts/inter-500.ttf"), weight: "500" });
  loadFont({ family: "Inter", url: staticFile("fonts/inter-600.ttf"), weight: "600" });
};

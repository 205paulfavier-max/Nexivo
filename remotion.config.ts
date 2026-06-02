import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(null); // auto
// Qualité d'encodage : CRF plus bas = meilleure qualité (18 = quasi sans perte visible)
Config.setCrf(18);

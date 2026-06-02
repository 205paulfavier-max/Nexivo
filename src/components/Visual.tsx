import React from "react";
import { AbsoluteFill } from "remotion";
import { VisualKind } from "../data/script";
import { DiamondLogo } from "./DiamondLogo";
import { JapanMap } from "./visuals/JapanMap";
import { PortraitFrame } from "./visuals/PortraitFrame";
import { IconMontage } from "./visuals/IconMontage";
import { Blasons } from "./visuals/Blasons";
import { ZaibatsuTree } from "./visuals/ZaibatsuTree";
import { WarScene } from "./visuals/WarScene";
import { FragmentBlock } from "./visuals/FragmentBlock";
import { ModernMontage } from "./visuals/ModernMontage";
import { TitleCard } from "./visuals/TitleCard";
import { CTACard } from "./visuals/CTACard";
import { FactText } from "./visuals/FactText";

/**
 * Routeur de visuels : à partir du champ `visual` d'une caption, affiche
 * la couche graphique correspondante. Centré par défaut, dans la moitié
 * haute pour laisser respirer le sous-titre en bas.
 */

const Centered: React.FC<{ children: React.ReactNode; up?: boolean }> = ({
  children,
  up = true,
}) => (
  <AbsoluteFill
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: up ? 180 : 0,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const Visual: React.FC<{ kind: VisualKind }> = ({ kind }) => {
  switch (kind) {
    case "logo":
      return (
        <Centered>
          <DiamondLogo size={360} />
        </Centered>
      );
    case "map":
      return <Centered>{<JapanMap />}</Centered>;
    case "portrait":
      return <Centered>{<PortraitFrame />}</Centered>;
    case "montage":
      return <Centered>{<IconMontage />}</Centered>;
    case "blasons":
      return <Centered>{<Blasons />}</Centered>;
    case "tree":
      return <Centered>{<ZaibatsuTree />}</Centered>;
    case "war":
      return <WarScene />;
    case "factText":
      return <FactText />;
    case "fragment":
      return <Centered>{<FragmentBlock />}</Centered>;
    case "modern":
      return <ModernMontage />;
    case "title":
      return <TitleCard />;
    case "cta":
      return <CTACard />;
    default:
      return null;
  }
};

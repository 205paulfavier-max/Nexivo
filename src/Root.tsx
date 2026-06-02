import React from "react";
import { Composition } from "remotion";
import { MitsubishiVideo } from "./MitsubishiVideo";
import { FPS, WIDTH, HEIGHT } from "./data/theme";
import { totalFrames } from "./timing";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MitsubishiVideo"
      component={MitsubishiVideo}
      durationInFrames={totalFrames()}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{
        voiceoverFile: undefined,
        musicFile: undefined,
      }}
    />
  );
};

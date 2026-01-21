import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Terminal3D } from "./Terminal3D";
import { IntegrationsScreen } from "./IntegrationsScreen";

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={210}>
          <Terminal3D />
        </Series.Sequence>
        <Series.Sequence durationInFrames={150}>
          <IntegrationsScreen />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

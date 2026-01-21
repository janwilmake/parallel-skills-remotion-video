import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Terminal3D } from "./Terminal3D";
import { AnnouncementScreen } from "./AnnouncementScreen";
import {
  ResearchScreen,
  EnrichmentsScreen,
  WebSearchScreen,
} from "./FeatureScreen";
import { IntegrationsScreen } from "./IntegrationsScreen";

type FadeTransitionProps = {
  children: React.ReactNode;
  durationInFrames: number;
  fadeOutStart?: number;
};

const FadeTransition: React.FC<FadeTransitionProps> = ({
  children,
  durationInFrames,
  fadeOutStart = 0.8,
}) => {
  const frame = useCurrentFrame();

  // Fade in at the start
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out near the end (skip if fadeOutStart >= 1)
  let opacity = fadeIn;
  if (fadeOutStart < 1) {
    const fadeOutFrame = durationInFrames * fadeOutStart;
    const fadeOut = interpolate(
      frame,
      [fadeOutFrame, durationInFrames],
      [1, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
    opacity = Math.min(fadeIn, fadeOut);
  }

  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
    </AbsoluteFill>
  );
};

export const MainVideo: React.FC = () => {
  // Timing configuration
  const TERMINAL_DURATION = 210;
  const ANNOUNCEMENT_DURATION = 75;
  const FEATURE_DURATION = 45;
  const INTEGRATIONS_DURATION = 120;

  // Calculate start frames
  const announcementStart = TERMINAL_DURATION - 15; // Overlap with fade
  const researchStart = announcementStart + ANNOUNCEMENT_DURATION - 10;
  const enrichmentsStart = researchStart + FEATURE_DURATION - 8;
  const webSearchStart = enrichmentsStart + FEATURE_DURATION - 8;
  const integrationsStart = webSearchStart + FEATURE_DURATION - 10;

  return (
    <AbsoluteFill
      style={{
        background: "#fcfcfa",
      }}
    >
      {/* Terminal - first screen */}
      <Sequence from={0} durationInFrames={TERMINAL_DURATION}>
        <FadeTransition durationInFrames={TERMINAL_DURATION} fadeOutStart={0.9}>
          <Terminal3D />
        </FadeTransition>
      </Sequence>

      {/* Announcement - "Parallel Skills Now Available!" */}
      <Sequence from={announcementStart} durationInFrames={ANNOUNCEMENT_DURATION}>
        <FadeTransition durationInFrames={ANNOUNCEMENT_DURATION} fadeOutStart={0.8}>
          <AnnouncementScreen />
        </FadeTransition>
      </Sequence>

      {/* Feature 1 - Research */}
      <Sequence from={researchStart} durationInFrames={FEATURE_DURATION}>
        <FadeTransition durationInFrames={FEATURE_DURATION} fadeOutStart={0.75}>
          <ResearchScreen />
        </FadeTransition>
      </Sequence>

      {/* Feature 2 - Enrichments */}
      <Sequence from={enrichmentsStart} durationInFrames={FEATURE_DURATION}>
        <FadeTransition durationInFrames={FEATURE_DURATION} fadeOutStart={0.75}>
          <EnrichmentsScreen />
        </FadeTransition>
      </Sequence>

      {/* Feature 3 - Web Search */}
      <Sequence from={webSearchStart} durationInFrames={FEATURE_DURATION}>
        <FadeTransition durationInFrames={FEATURE_DURATION} fadeOutStart={0.75}>
          <WebSearchScreen />
        </FadeTransition>
      </Sequence>

      {/* Integrations - final screen */}
      <Sequence from={integrationsStart} durationInFrames={INTEGRATIONS_DURATION}>
        <FadeTransition durationInFrames={INTEGRATIONS_DURATION} fadeOutStart={1}>
          <IntegrationsScreen />
        </FadeTransition>
      </Sequence>
    </AbsoluteFill>
  );
};

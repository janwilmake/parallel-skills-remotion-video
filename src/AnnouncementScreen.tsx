import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Parallel brand colors
const COLORS = {
  offWhite: "#fcfcfa",
  indexBlack: "#1d1b16",
  neural: "#d8d0bf",
  signal: "#fb631b",
};

export const AnnouncementScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entranceProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const textScale = interpolate(entranceProgress, [0, 1], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textOpacity = interpolate(entranceProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const subtitleOpacity = interpolate(subtitleProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleY = interpolate(subtitleProgress, [0, 1], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.offWhite,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Main title */}
      <div
        style={{
          opacity: textOpacity,
          transform: `scale(${textScale})`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: '"Gerstner Programm", "Helvetica Neue", sans-serif',
            fontSize: 100,
            fontWeight: 500,
            color: COLORS.indexBlack,
            margin: 0,
            letterSpacing: -3,
          }}
        >
          Parallel Skills
        </h1>
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          marginTop: 30,
        }}
      >
        <span
          style={{
            fontFamily: '"Gerstner Programm", "Helvetica Neue", sans-serif',
            fontSize: 52,
            fontWeight: 500,
            color: COLORS.signal,
            letterSpacing: -1,
          }}
        >
          Now Available!
        </span>
      </div>
    </AbsoluteFill>
  );
};

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

type FeatureScreenProps = {
  title: string;
  icon: string;
};

export const FeatureScreen: React.FC<FeatureScreenProps> = ({
  title,
  icon,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Icon entrance - pops in with spring
  const iconProgress = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  const iconScale = interpolate(iconProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const iconRotation = interpolate(iconProgress, [0, 1], [-180, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title entrance - slides up after icon
  const titleProgress = spring({
    frame: frame - 8,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleY = interpolate(titleProgress, [0, 1], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle glow pulse
  const glowPulse = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.08, 0.15]);

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
      {/* Subtle background glow */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.signal}${Math.round(glowPulse * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Icon */}
      <div
        style={{
          transform: `scale(${iconScale}) rotate(${iconRotation}deg)`,
          fontSize: 140,
          marginBottom: 40,
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <h2
          style={{
            fontFamily: '"Gerstner Programm", "Helvetica Neue", sans-serif',
            fontSize: 72,
            fontWeight: 500,
            color: COLORS.indexBlack,
            margin: 0,
            letterSpacing: -2,
          }}
        >
          {title}
        </h2>
      </div>
    </AbsoluteFill>
  );
};

// Pre-configured feature screens
export const ResearchScreen: React.FC = () => (
  <FeatureScreen title="Research" icon="🔬" />
);

export const EnrichmentsScreen: React.FC = () => (
  <FeatureScreen title="Enrichments" icon="✨" />
);

export const WebSearchScreen: React.FC = () => (
  <FeatureScreen title="Web Search" icon="🌐" />
);

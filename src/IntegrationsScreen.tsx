import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
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

const INTEGRATIONS = [
  { name: "Claude Code", logo: "logos/claude.png" },
  { name: "Cursor", logo: "logos/cursor.png" },
  { name: "OpenCode", logo: "logos/opencode.avif" },
  { name: "Kiro", logo: "logos/kiro.png" },
  { name: "Antigravity", logo: "logos/antigravity.jpeg" },
];

type LogoItemProps = {
  logo: string;
  name: string;
  index: number;
};

const LogoItem: React.FC<LogoItemProps> = ({ logo, name, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const staggerDelay = index * 8;

  const entranceProgress = spring({
    frame: frame - staggerDelay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const opacity = interpolate(frame - staggerDelay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(entranceProgress, [0, 1], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const y = interpolate(entranceProgress, [0, 1], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        opacity,
        transform: `scale(${scale}) translateY(${y}px)`,
      }}
    >
      <div
        style={{
          width: 90,
          height: 90,
          borderRadius: 16,
          backgroundColor: COLORS.neural,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 15,
        }}
      >
        <Img
          src={staticFile(logo)}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            filter: logo.includes("kiro") ? "brightness(0)" : undefined,
          }}
        />
      </div>
      <span
        style={{
          color: COLORS.indexBlack,
          fontSize: 14,
          fontFamily: '"Gerstner Programm", "Helvetica Neue", sans-serif',
          fontWeight: 500,
        }}
      >
        {name}
      </span>
    </div>
  );
};

export const IntegrationsScreen: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const entranceProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const contentOpacity = interpolate(entranceProgress, [0, 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const contentScale = interpolate(entranceProgress, [0, 1], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleY = interpolate(entranceProgress, [0, 1], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.offWhite,
      }}
    >
      {/* Content - pops out directly */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: contentOpacity,
          transform: `scale(${contentScale})`,
        }}
      >
        {/* Parallel Logo */}
        <div
          style={{
            transform: `translateY(${titleY}px)`,
            marginBottom: 30,
          }}
        >
          <Img
            src={staticFile("logos/parallel.png")}
            style={{
              height: 70,
              objectFit: "contain",
              filter: "brightness(0)",
            }}
          />
        </div>

        {/* Plus symbol */}
        <div
          style={{
            color: COLORS.neural,
            fontSize: 90,
            fontFamily: '"Gerstner Programm", "Helvetica Neue", sans-serif',
            fontWeight: 400,
            marginBottom: 50,
            transform: `translateY(${titleY}px)`,
          }}
        >
          +
        </div>

        {/* Integration logos */}
        <div
          style={{
            display: "flex",
            gap: 60,
            alignItems: "flex-start",
          }}
        >
          {INTEGRATIONS.map((integration, index) => (
            <LogoItem
              key={integration.name}
              logo={integration.logo}
              name={integration.name}
              index={index}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

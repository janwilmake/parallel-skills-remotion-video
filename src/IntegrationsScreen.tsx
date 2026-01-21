import { ThreeCanvas } from "@remotion/three";
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

const INTEGRATIONS = [
  { name: "Claude Code", logo: "logos/claude.png" },
  { name: "Cursor", logo: "logos/cursor.png" },
  { name: "OpenCode", logo: "logos/opencode.avif" },
  { name: "Kiro", logo: "logos/kiro.png" },
  { name: "Antigravity", logo: "logos/antigravity.jpeg" },
];

const MonitorFrame: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entranceProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const rotationY = interpolate(entranceProgress, [0, 1], [-0.5, 0.1]);
  const rotationX = interpolate(entranceProgress, [0, 1], [0.3, -0.03]);
  const positionZ = interpolate(entranceProgress, [0, 1], [-10, 0]);
  const scale = interpolate(entranceProgress, [0, 1], [0.5, 1]);

  const idleRotation = Math.sin(frame * 0.015) * 0.015;

  const baseScale = 0.45;

  return (
    <group
      rotation={[rotationX, rotationY + idleRotation, 0]}
      position={[0, 0.5, positionZ]}
      scale={[scale * baseScale, scale * baseScale, scale * baseScale]}
    >
      {/* Monitor stand base */}
      <mesh position={[0, -6.5, -1]}>
        <cylinderGeometry args={[3, 3.5, 0.4, 32]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Monitor stand neck */}
      <mesh position={[0, -5.5, -0.8]}>
        <boxGeometry args={[1.2, 2, 0.8]} />
        <meshStandardMaterial color="#252538" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Monitor back casing */}
      <mesh position={[0, 0, -1.5]}>
        <boxGeometry args={[19, 11, 2.5]} />
        <meshStandardMaterial color="#0f0f1a" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Monitor back vents */}
      {[-3, -1, 1, 3].map((x) => (
        <mesh key={x} position={[x, 0, -2.8]}>
          <boxGeometry args={[0.8, 6, 0.1]} />
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      ))}

      {/* Monitor frame - outer */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[19.5, 11.5, 0.8]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Monitor bezel */}
      <mesh position={[0, 0, 0.25]}>
        <boxGeometry args={[18.5, 10.5, 0.3]} />
        <meshStandardMaterial color="#252538" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Screen inset */}
      <mesh position={[0, 0, 0.35]}>
        <boxGeometry args={[17.5, 9.5, 0.15]} />
        <meshStandardMaterial color="#0a0a12" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Screen surface */}
      <mesh position={[0, 0, 0.44]}>
        <planeGeometry args={[17, 9]} />
        <meshStandardMaterial
          color="#0d1117"
          metalness={0.1}
          roughness={0.1}
          emissive="#0d1117"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Power LED */}
      <mesh position={[8, -5, 0.4]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#00ff00"
          emissive="#00ff00"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
};

type LogoItemProps = {
  logo: string;
  name: string;
  index: number;
  total: number;
};

const LogoItem: React.FC<LogoItemProps> = ({ logo, name, index, total }) => {
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
          backgroundColor: "rgba(255, 255, 255, 0.1)",
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
          }}
        />
      </div>
      <span
        style={{
          color: "#a0a0b0",
          fontSize: 14,
          fontFamily: '"SF Pro", "Helvetica Neue", sans-serif',
          fontWeight: 500,
        }}
      >
        {name}
      </span>
    </div>
  );
};

export const IntegrationsScreen: React.FC = () => {
  const { width, height, fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const entranceProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const contentOpacity = interpolate(entranceProgress, [0.3, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleY = interpolate(entranceProgress, [0, 1], [-50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)",
      }}
    >
      {/* 3D Monitor Frame */}
      <ThreeCanvas width={width} height={height}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 10]} intensity={1.2} />
        <pointLight position={[-5, -5, 5]} intensity={0.6} color="#4a9eff" />
        <pointLight position={[5, -3, 5]} intensity={0.4} color="#9945ff" />
        <pointLight position={[0, 5, 3]} intensity={0.3} color="#ffffff" />
        <MonitorFrame />
      </ThreeCanvas>

      {/* Content Overlay */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: contentOpacity,
          pointerEvents: "none",
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
              height: 60,
              objectFit: "contain",
            }}
          />
        </div>

        {/* Plus symbol */}
        <div
          style={{
            color: "#6b7280",
            fontSize: 80,
            fontFamily: '"SF Pro", "Helvetica Neue", sans-serif',
            fontWeight: 200,
            marginBottom: 40,
            transform: `translateY(${titleY}px)`,
          }}
        >
          +
        </div>

        {/* Integration logos */}
        <div
          style={{
            display: "flex",
            gap: 50,
            alignItems: "flex-start",
          }}
        >
          {INTEGRATIONS.map((integration, index) => (
            <LogoItem
              key={integration.name}
              logo={integration.logo}
              name={integration.name}
              index={index}
              total={INTEGRATIONS.length}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

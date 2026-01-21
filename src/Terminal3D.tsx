import { ThreeCanvas } from "@remotion/three";
import React, { useMemo, useEffect } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";

const COMMAND_LINE = { text: "$ npx skills add parallel-web/skills", delay: 0 };
const BANNER_DELAY = 50;
const STATUS_LINES = [
  { text: "◇  Repository cloned", delay: 90 },
  { text: "◇  Found 3 skills", delay: 110 },
  { text: "◇  Installation complete", delay: 130 },
];

const SKILLS_BANNER = [
  "███████╗██╗  ██╗██╗██╗     ██╗     ███████╗",
  "██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝",
  "███████╗█████╔╝ ██║██║     ██║     ███████╗",
  "╚════██║██╔═██╗ ██║██║     ██║     ╚════██║",
  "███████║██║  ██╗██║███████╗███████╗███████║",
  "╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝",
];

type SkillsBanner3DProps = {
  delay: number;
  yPosition: number;
};

const SkillsBanner3D: React.FC<SkillsBanner3DProps> = ({ delay, yPosition }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const canvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 2048;
    c.height = 512;
    return c;
  }, []);

  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, [canvas]);

  useEffect(() => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold 48px "SF Mono", "Monaco", "Consolas", monospace`;
    ctx.fillStyle = "#a0a0a0";
    ctx.textBaseline = "top";

    SKILLS_BANNER.forEach((line, index) => {
      ctx.fillText(line, 80, 20 + index * 55);
    });

    texture.needsUpdate = true;
  }, [canvas, texture]);

  if (frame < delay) return null;

  return (
    <mesh position={[0, yPosition, 0.46]}>
      <planeGeometry args={[16, 3.5]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

type TerminalTextLine3DProps = {
  text: string;
  delay: number;
  isCommand: boolean;
  yPosition: number;
  typeEffect?: boolean;
};

const TerminalTextLine3D: React.FC<TerminalTextLine3DProps> = ({
  text,
  delay,
  isCommand,
  yPosition,
  typeEffect = true,
}) => {
  const frame = useCurrentFrame();

  const visibleChars = typeEffect
    ? Math.floor(
        interpolate(frame - delay, [0, text.length * 2], [0, text.length], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      )
    : text.length;

  const displayText = text.slice(0, visibleChars);

  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cursorVisible =
    typeEffect &&
    isCommand &&
    visibleChars < text.length &&
    Math.floor((frame - delay) / 8) % 2 === 0;

  const color = text.startsWith("$")
    ? "#58a6ff"
    : text.startsWith("✓") || text.startsWith("◇")
      ? "#3fb950"
      : "#e6edf3";

  const canvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 2048;
    c.height = 128;
    return c;
  }, []);

  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, [canvas]);

  useEffect(() => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold 72px "SF Mono", "Monaco", "Consolas", monospace`;
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.fillText(displayText + (cursorVisible ? "█" : ""), 80, canvas.height / 2);

    texture.needsUpdate = true;
  }, [canvas, texture, displayText, cursorVisible, color]);

  if (frame < delay) return null;

  return (
    <mesh position={[0, yPosition, 0.46]}>
      <planeGeometry args={[16, 0.9]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

type TerminalWithTextProps = {
  children?: React.ReactNode;
};

const TerminalWithText: React.FC<TerminalWithTextProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entranceProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const rotationY = interpolate(entranceProgress, [0, 1], [-0.5, 0.15]);
  const rotationX = interpolate(entranceProgress, [0, 1], [0.3, -0.05]);
  const positionZ = interpolate(entranceProgress, [0, 1], [-10, 0]);
  const scale = interpolate(entranceProgress, [0, 1], [0.5, 1]);

  const idleRotation = Math.sin(frame * 0.02) * 0.02;

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

      {/* Monitor back casing - deep */}
      <mesh position={[0, 0, -1.5]}>
        <boxGeometry args={[19, 11, 2.5]} />
        <meshStandardMaterial color="#0f0f1a" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Monitor back vents */}
      {[-3, -1, 1, 3].map((x) => (
        <mesh key={x} position={[x, 0, -2.8]}>
          <boxGeometry args={[0.8, 6, 0.1]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}

      {/* Monitor frame - outer */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[19.5, 11.5, 0.8]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Monitor bezel - inner frame */}
      <mesh position={[0, 0, 0.25]}>
        <boxGeometry args={[18.5, 10.5, 0.3]} />
        <meshStandardMaterial color="#252538" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Screen inset/recess */}
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

      {/* Screen edge glow */}
      <mesh position={[0, 0, 0.43]}>
        <planeGeometry args={[17.2, 9.2]} />
        <meshBasicMaterial color="#1a2a3a" transparent opacity={0.3} />
      </mesh>

      {/* Title bar */}
      <mesh position={[0, 4.05, 0.45]}>
        <planeGeometry args={[17, 0.8]} />
        <meshStandardMaterial color="#161b22" />
      </mesh>

      {/* Window buttons */}
      <mesh position={[-7.5, 4.05, 0.47]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#ff5f56"
          emissive="#ff5f56"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[-6.9, 4.05, 0.47]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#ffbd2e"
          emissive="#ffbd2e"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[-6.3, 4.05, 0.47]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#27ca40"
          emissive="#27ca40"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Corner accents */}
      <mesh position={[-9.5, 5.5, 0.1]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
        <meshStandardMaterial color="#3d3d5c" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[9.5, 5.5, 0.1]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
        <meshStandardMaterial color="#3d3d5c" metalness={0.8} roughness={0.2} />
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

      {/* Command line */}
      <TerminalTextLine3D
        text={COMMAND_LINE.text}
        delay={COMMAND_LINE.delay}
        isCommand={true}
        yPosition={3.2}
      />

      {/* Skills ASCII banner */}
      <SkillsBanner3D delay={BANNER_DELAY} yPosition={0.8} />

      {/* Status lines */}
      {STATUS_LINES.map((line, index) => (
        <TerminalTextLine3D
          key={index}
          text={line.text}
          delay={line.delay}
          isCommand={false}
          yPosition={-1.8 - index * 1.2}
          typeEffect={false}
        />
      ))}
    </group>
  );
};

export const Terminal3D: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)",
      }}
    >
      <ThreeCanvas width={width} height={height}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 10]} intensity={1.2} />
        <pointLight position={[-5, -5, 5]} intensity={0.6} color="#4a9eff" />
        <pointLight position={[5, -3, 5]} intensity={0.4} color="#9945ff" />
        <pointLight position={[0, 5, 3]} intensity={0.3} color="#ffffff" />
        <TerminalWithText />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

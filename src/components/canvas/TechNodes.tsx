"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { techStackData } from "@/content/techstack";
import Image from "next/image";
import * as THREE from "three";

export type TechFilter = "all" | "primary" | "secondary";

interface TechNodesProps {
  filter?: TechFilter;
  onHoverChange?: (hovered: boolean) => void;
}

interface NodeData {
  id: string;
  text: string;
  category: string;
  isPrimary: boolean;
  position: THREE.Vector3;
  floatSpeed: number;
  timeOffset: number;
}

const iconMap: Record<string, string> = {
  TypeScript: "ts",
  "Next.js": "nextjs",
  React: "react",
  NestJS: "nestjs",
  Laravel: "laravel",
  Flutter: "flutter",
  "Tailwind CSS": "tailwind",
  PHP: "php",
  JavaScript: "js",
  Dart: "dart",
  PostgreSQL: "postgres",
  MySQL: "mysql",
  Prisma: "prisma",
  Redis: "redis",
  Firebase: "firebase",
  "GitHub Actions": "githubactions",
  Sentry: "sentry",
  Git: "git",
  Docker: "docker",
  "Node.js": "nodejs",
  HTML5: "html",
};

const categoryMap: Record<string, string> = {
  TypeScript: "Language",
  JavaScript: "Language",
  PHP: "Language",
  Dart: "Language",
  "Next.js": "Fullstack",
  React: "Frontend",
  NestJS: "Backend",
  Laravel: "Backend",
  Flutter: "Mobile",
  "Tailwind CSS": "Styling",
  PostgreSQL: "Database",
  MySQL: "Database",
  Prisma: "ORM",
  Redis: "Cache",
  BullMQ: "Queue",
  Turborepo: "Monorepo",
  Firebase: "Cloud",
  WebSocket: "Realtime",
  "GitHub Actions": "CI/CD",
  PM2: "Process Mgr",
  Sentry: "Monitoring",
  Git: "Version Ctrl",
};

function CustomTechIcon({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case "Turborepo":
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
          <rect width="36" height="36" rx="8" fill="#18181B" />
          <circle
            cx="18"
            cy="18"
            r="10"
            stroke="#EF4444"
            strokeWidth="2.6"
            strokeDasharray="32 32"
          />
          <circle
            cx="18"
            cy="18"
            r="10"
            stroke="#3B82F6"
            strokeWidth="2.6"
            strokeDasharray="32 32"
            strokeDashoffset="32"
          />
          <circle cx="18" cy="18" r="4.2" fill="#F4F4F5" />
        </svg>
      );
    case "BullMQ":
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
          <rect width="36" height="36" rx="8" fill="#1F1215" />
          <path
            d="M10 12L14 16H22L26 12"
            stroke="#F87171"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M19.5 14L14.5 20.5H18.5L16.5 26L22.5 19H18.5L19.5 14Z" fill="#EF4444" />
        </svg>
      );
    case "WebSocket":
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
          <rect width="36" height="36" rx="8" fill="#111827" />
          <path
            d="M10 14H24M24 14L20 10M24 14L20 18"
            stroke="#38BDF8"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M26 22H12M12 22L16 18M12 22L16 26"
            stroke="#818CF8"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "PM2":
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
          <rect width="36" height="36" rx="8" fill="#14141D" />
          <path
            d="M7 20H12L15 12L19 24L22 17H29"
            stroke="#22C55E"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="28" cy="17" r="2" fill="#A855F7" />
        </svg>
      );
    default:
      return (
        <div
          className={`rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-mono font-bold text-xs text-white ${className}`}
        >
          {name.slice(0, 2).toUpperCase()}
        </div>
      );
  }
}

export function TechNodes({ filter = "all", onHoverChange }: TechNodesProps) {
  // Evenly distribute nodes using a Golden-Angle Fibonacci Ellipsoid so nodes never overlap
  const nodes = useMemo<NodeData[]>(() => {
    const allTech = [...techStackData.primary, ...techStackData.secondary];
    const total = allTech.length;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    return allTech.map((tech, idx) => {
      const isPrimary = idx < techStackData.primary.length;

      // Normalized vertical coordinate (-0.85 to 0.85 to avoid bunching at poles)
      const yNorm = 1 - ((idx + 0.5) / total) * 2;
      const radiusAtY = Math.sqrt(Math.max(0.05, 1 - yNorm * yNorm));
      const theta = goldenAngle * idx;

      // Primary nodes sit on a slightly more prominent radius
      const rx = isPrimary ? 11.2 : 12.6;
      const ry = isPrimary ? 5.2 : 6.0;
      const rz = isPrimary ? 8.2 : 9.4;

      const x = Math.cos(theta) * radiusAtY * rx;
      const y = yNorm * ry;
      const z = Math.sin(theta) * radiusAtY * rz;

      return {
        id: tech,
        text: tech,
        category: categoryMap[tech] || (isPrimary ? "Core" : "Ecosystem"),
        isPrimary,
        position: new THREE.Vector3(x, y, z),
        floatSpeed: 0.9 + (idx % 5) * 0.15,
        timeOffset: idx * 0.7,
      };
    });
  }, []);

  // Build subtle 3D constellation lines connecting nearest neighbors
  const lineGeometry = useMemo(() => {
    const positions: number[] = [];
    const maxDist = 7.8;

    for (let i = 0; i < nodes.length; i++) {
      let connections = 0;
      for (let j = i + 1; j < nodes.length; j++) {
        if (connections >= 2) break;
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < maxDist) {
          positions.push(
            nodes[i].position.x,
            nodes[i].position.y,
            nodes[i].position.z,
            nodes[j].position.x,
            nodes[j].position.y,
            nodes[j].position.z
          );
          connections++;
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [nodes]);

  return (
    <group>
      {/* Subtle Constellation Filaments */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.06} depthWrite={false} />
      </lineSegments>

      {nodes.map((node) => {
        const isDimmed =
          (filter === "primary" && !node.isPrimary) || (filter === "secondary" && node.isPrimary);

        return (
          <TechNode key={node.id} node={node} isDimmed={isDimmed} onHoverChange={onHoverChange} />
        );
      })}
    </group>
  );
}

function TechNode({
  node,
  isDimmed,
  onHoverChange,
}: {
  node: NodeData;
  isDimmed: boolean;
  onHoverChange?: (hovered: boolean) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        node.position.y +
        Math.sin(state.clock.elapsedTime * node.floatSpeed + node.timeOffset) * 0.22;
    }
  });

  const iconKey = iconMap[node.text];

  return (
    <mesh ref={meshRef} position={node.position}>
      <sphereGeometry args={[0.08, 6, 6]} />
      <meshBasicMaterial visible={false} />
      <Html center distanceFactor={16} zIndexRange={[10, 0]}>
        <div
          onMouseEnter={() => onHoverChange?.(true)}
          onMouseLeave={() => onHoverChange?.(false)}
          className={`group flex items-center gap-2.5 rounded-xl select-none transition-all duration-200 will-change-transform ${
            node.isPrimary
              ? "px-3.5 py-2 bg-[#17171f]/95 border border-white/20 shadow-[0_6px_20px_rgba(0,0,0,0.45)] hover:border-white/60 hover:scale-110"
              : "px-3 py-1.5 bg-[#121218]/90 border border-white/10 shadow-[0_4px_14px_rgba(0,0,0,0.35)] hover:border-white/45 hover:scale-110"
          } ${isDimmed ? "opacity-20 scale-90 pointer-events-none" : "opacity-100"}`}
        >
          {/* Technology Logo */}
          <div
            className={`relative shrink-0 flex items-center justify-center ${
              node.isPrimary ? "w-7 h-7 md:w-8 md:h-8" : "w-6 h-6 md:w-7 md:h-7"
            }`}
          >
            {iconKey ? (
              <Image
                src={`https://skillicons.dev/icons?i=${iconKey}`}
                alt={node.text}
                width={32}
                height={32}
                unoptimized
                draggable={false}
                className="w-full h-full object-contain pointer-events-none"
              />
            ) : (
              <CustomTechIcon name={node.text} className="w-full h-full" />
            )}
          </div>

          {/* Technology Name & Category Tag */}
          <div className="flex flex-col leading-tight pr-0.5">
            <span
              className={` whitespace-nowrap font-sans tracking-tight ${
                node.isPrimary
                  ? "text-xs md:text-[13px] font-bold text-white"
                  : "text-[11px] md:text-xs font-semibold text-zinc-200"
              }`}
            >
              {node.text}
            </span>
            <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">
              {node.category}
            </span>
          </div>
        </div>
      </Html>
    </mesh>
  );
}

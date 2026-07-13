"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { techStackData } from "@/content/techstack";
import * as THREE from "three";

export function TechNodes() {
  const groupRef = useRef<THREE.Group>(null);

  // Combine primary and secondary for display, give them random initial positions
  const [nodes] = useState(() => {
    const allTech = [...techStackData.primary, ...techStackData.secondary];
    return allTech.map((tech, idx) => {
      const isPrimary = idx < techStackData.primary.length;
      return {
        id: tech,
        text: tech,
        isPrimary,
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 5
        ),
        speed: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
        timeOffset: Math.random() * Math.PI * 2,
      };
    });
  });

  useFrame(() => {
    if (groupRef.current) {
      // Slow rotation of the entire group
      groupRef.current.rotation.y += 0.001;
      groupRef.current.rotation.x += 0.0005;
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node) => (
        <TechNode key={node.id} node={node} />
      ))}
    </group>
  );
}

interface NodeData {
  id: string;
  text: string;
  isPrimary: boolean;
  position: THREE.Vector3;
  speed: number;
  timeOffset: number;
}

const iconMap: Record<string, string> = {
  React: "react",
  Laravel: "laravel",
  Flutter: "flutter",
  TypeScript: "ts",
  HTML5: "html",
  JavaScript: "js",
  PHP: "php",
  MySQL: "mysql",
  Redis: "redis",
  Git: "git",
};

function TechNode({ node }: { node: NodeData }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      // Calculate absolute position rather than adding delta to prevent drifting
      meshRef.current.position.y =
        node.position.y +
        Math.sin(Date.now() * 0.001 * Math.abs(node.speed) * 10 + node.timeOffset) * 0.5;
    }
  });

  const iconName = iconMap[node.text];

  return (
    <mesh ref={meshRef} position={node.position}>
      {/* Invisible mesh to act as an anchor for the HTML label */}
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial visible={false} />
      <Html center distanceFactor={15}>
        <div
          className={`relative group flex flex-col items-center justify-center transition-transform hover:scale-110 ${
            node.isPrimary ? "w-24 h-24 md:w-32 md:h-32" : "w-16 h-16 md:w-20 md:h-20"
          }`}
        >
          {iconName ? (
            <img
              src={`https://skillicons.dev/icons?i=${iconName}`}
              alt={node.text}
              className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]"
            />
          ) : (
            <div className="px-3 py-1.5 rounded-lg whitespace-nowrap select-none bg-[#070B14]/60 border border-[#818CF8]/50 text-[#94A3B8] text-sm backdrop-blur-sm">
              {node.text}
            </div>
          )}

          {/* Tooltip on hover */}
          <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0F172A] border border-[#1E293B] text-[#F8FAFC] text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
            {node.text}
          </span>
        </div>
      </Html>
    </mesh>
  );
}

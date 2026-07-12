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
}

function TechNode({ node }: { node: NodeData }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(Date.now() * 0.001 * Math.abs(node.speed)) * 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={node.position}>
      {/* Invisible mesh to act as an anchor for the HTML label */}
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial visible={false} />
      <Html center distanceFactor={15}>
        <div
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap select-none ${
            node.isPrimary
              ? "bg-[#0F172A]/80 border border-[#38BDF8] text-[#F8FAFC] text-base font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)]"
              : "bg-[#070B14]/60 border border-[#818CF8]/50 text-[#94A3B8] text-sm"
          } backdrop-blur-sm`}
        >
          {node.text}
        </div>
      </Html>
    </mesh>
  );
}

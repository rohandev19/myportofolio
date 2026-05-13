"use client";

import { Canvas } from "@react-three/fiber";
import { AmbientParticles } from "./AmbientParticles";
import { TechNodes } from "./TechNodes";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";

export function TechGalaxyCanvas() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-[60vh] md:h-[80vh] cursor-grab active:cursor-grabbing">
      <Canvas
        frameloop="always"
        camera={{ position: [0, 0, 20], fov: 60 }}
        gl={{ powerPreference: "high-performance", antialias: false }}
      >
        <color attach="background" args={["#070B14"]} />
        <ambientLight intensity={0.5} />

        {/* Particle background */}
        <AmbientParticles />

        {/* Floating tech nodes */}
        <TechNodes />

        {/* Allow users to rotate the galaxy */}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}

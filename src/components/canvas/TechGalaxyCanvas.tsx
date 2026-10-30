"use client";

import { Canvas } from "@react-three/fiber";
import { AmbientParticles } from "./AmbientParticles";
import { TechNodes, TechFilter } from "./TechNodes";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";

export function TechGalaxyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [filter, setFilter] = useState<TechFilter>("all");
  const [isPaused, setIsPaused] = useState(false);
  const [isNodeHovered, setIsNodeHovered] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Pause WebGL render loop when scrolled out of viewport for smoother page performance
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "150px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted]);

  if (!mounted) return null;

  const shouldAutoRotate = !isPaused && !isNodeHovered;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[64vh] md:h-[78vh] bg-[#0e0e12] cursor-grab active:cursor-grabbing select-none"
    >
      {/* Top Interactive HUD Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#16161d]/85 backdrop-blur-md border border-white/10 p-1 rounded-xl pointer-events-auto">
          {(
            [
              { id: "all", label: "All Tech" },
              { id: "primary", label: "Core Stack" },
              { id: "secondary", label: "Data & Infra" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                filter === tab.id
                  ? "bg-white text-[#0e0e12] font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orbit Play/Pause Toggle */}
        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#16161d]/85 backdrop-blur-md border border-white/10 text-xs font-mono text-zinc-300 hover:text-white hover:border-white/25 transition-all cursor-pointer"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              shouldAutoRotate ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"
            }`}
          />
          {isPaused ? "Resume Orbit" : "Pause Orbit"}
        </button>
      </div>

      {/* Subtle Radial Studio Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(circle at center, transparent 55%, rgba(10,10,14,0.65) 100%)",
        }}
      />

      {/* 3D Constellation Canvas */}
      <Canvas
        frameloop={isInView ? "always" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 21], fov: 55 }}
        gl={{ powerPreference: "high-performance", antialias: true }}
      >
        <color attach="background" args={["#0e0e12"]} />
        <ambientLight intensity={0.6} />

        {/* Single-draw-call starlight field */}
        <AmbientParticles />

        {/* Evenly distributed Fibonacci tech constellation */}
        <TechNodes filter={filter} onHoverChange={setIsNodeHovered} />

        {/* Smooth damped orbital camera controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.045}
          rotateSpeed={0.65}
          autoRotate={shouldAutoRotate}
          autoRotateSpeed={0.65}
          minPolarAngle={Math.PI * 0.28}
          maxPolarAngle={Math.PI * 0.72}
        />
      </Canvas>

      {/* Bottom Interactive Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="px-3.5 py-1.5 rounded-full bg-[#16161d]/75 border border-white/10 text-[11px] font-mono text-zinc-400 whitespace-nowrap">
          Drag to rotate 360° • Hover node to pause
        </div>
      </div>
    </div>
  );
}

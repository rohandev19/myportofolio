"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function AmbientOrbs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 2;
        const y = (e.clientY / innerHeight - 0.5) * 2;

        // Parallax effect throttled to animation frames
        if (orb1Ref.current) {
          gsap.to(orb1Ref.current, {
            x: x * -40,
            y: y * -40,
            duration: 1.5,
            ease: "power2.out",
            overwrite: "auto",
          });
        }

        if (orb2Ref.current) {
          gsap.to(orb2Ref.current, {
            x: x * 50,
            y: y * 50,
            duration: 1.8,
            ease: "power2.out",
            overwrite: "auto",
          });
        }

        if (orb3Ref.current) {
          gsap.to(orb3Ref.current, {
            x: x * -25,
            y: y * 60,
            duration: 2,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[0] overflow-hidden">
      {/* Orb 1: Blue */}
      <div
        ref={orb1Ref}
        className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[#1A4A4E] opacity-[0.06] blur-[100px] mix-blend-screen will-change-transform transform-gpu"
      />
      {/* Orb 2: Purple */}
      <div
        ref={orb2Ref}
        className="absolute bottom-[10%] right-[5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full bg-[#7B8794] opacity-[0.04] blur-[120px] mix-blend-screen will-change-transform transform-gpu"
      />
      {/* Orb 3: Cyan */}
      <div
        ref={orb3Ref}
        className="absolute top-[40%] right-[30%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-[#5A6677] opacity-[0.03] blur-[90px] mix-blend-screen will-change-transform transform-gpu"
      />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function AmbientOrbs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;

      // Parallax effect
      gsap.to(orb1Ref.current, {
        x: x * -50,
        y: y * -50,
        duration: 2,
        ease: "power2.out",
      });

      gsap.to(orb2Ref.current, {
        x: x * 70,
        y: y * 70,
        duration: 2.5,
        ease: "power2.out",
      });

      gsap.to(orb3Ref.current, {
        x: x * -30,
        y: y * 90,
        duration: 3,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[0] overflow-hidden">
      {/* Orb 1: Blue */}
      <div
        ref={orb1Ref}
        className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[#38BDF8] opacity-[0.04] blur-[100px] mix-blend-screen"
      />
      {/* Orb 2: Purple */}
      <div
        ref={orb2Ref}
        className="absolute bottom-[10%] right-[5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full bg-[#818CF8] opacity-[0.03] blur-[120px] mix-blend-screen"
      />
      {/* Orb 3: Cyan */}
      <div
        ref={orb3Ref}
        className="absolute top-[40%] right-[30%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-[#22D3EE] opacity-[0.02] blur-[90px] mix-blend-screen"
      />
    </div>
  );
}

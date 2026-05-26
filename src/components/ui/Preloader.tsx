"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Prevent scrolling during preloader
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "auto";
        onComplete();
      },
    });

    // Animate counter from 0 to 100
    const counterObject = { value: 0 };
    tl.to(counterObject, {
      value: 100,
      duration: 2.5, // 2.5 seconds loading
      ease: "power2.inOut",
      onUpdate: () => {
        setProgress(Math.round(counterObject.value));
      },
    });

    // Add a slight pause at 100%
    tl.to({}, { duration: 0.3 });

    // Hide counter
    tl.to(counterRef.current, {
      opacity: 0,
      duration: 0.3,
    });

    // Split doors
    tl.to(
      leftDoorRef.current,
      {
        xPercent: -100,
        duration: 1.2,
        ease: "power4.inOut",
      },
      "split"
    );
    tl.to(
      rightDoorRef.current,
      {
        xPercent: 100,
        duration: 1.2,
        ease: "power4.inOut",
      },
      "split"
    );

    // Hide container completely after doors open
    tl.to(containerRef.current, {
      display: "none",
      duration: 0,
    });

    return () => {
      document.body.style.overflow = "auto";
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
    >
      {/* Left Door */}
      <div
        ref={leftDoorRef}
        className="absolute top-0 left-0 w-1/2 h-full bg-[#070B14] border-r border-[#1E293B]/50"
      />
      {/* Right Door */}
      <div
        ref={rightDoorRef}
        className="absolute top-0 right-0 w-1/2 h-full bg-[#070B14] border-l border-[#1E293B]/50"
      />

      {/* Counter */}
      <div ref={counterRef} className="relative z-10 flex flex-col items-center">
        <div className="text-[#38BDF8] text-sm font-mono tracking-widest uppercase mb-4 opacity-80">
          Initializing System
        </div>
        <div className="text-6xl md:text-8xl font-black text-[#F8FAFC] font-mono tracking-tighter">
          {progress.toString().padStart(3, "0")}
          <span className="text-[#38BDF8] text-4xl md:text-6xl">%</span>
        </div>

        {/* Loading Bar */}
        <div className="w-64 h-1 bg-[#1E293B] mt-8 overflow-hidden rounded-full relative">
          <div
            className="absolute top-0 left-0 h-full bg-[#38BDF8] shadow-[0_0_10px_#38BDF8]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

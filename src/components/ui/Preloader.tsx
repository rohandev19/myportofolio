"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
  onReady?: () => void;
}

export function Preloader({ onComplete, onReady }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const backdropGlowRef = useRef<HTMLDivElement>(null);

  const onCompleteRef = useRef(onComplete);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onReadyRef.current = onReady;
  }, [onComplete, onReady]);

  useEffect(() => {
    // Lock scroll while preloader is active
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const getStageLabel = (val: number) => {
      if (val < 30) return "Initializing Environment";
      if (val < 70) return "Loading Visual Assets";
      if (val < 100) return "Preparing Interface";
      return "Experience Ready";
    };

    const ctx = gsap.context(() => {
      const counter = { value: 0 };

      const updateReadout = (raw: number) => {
        const clamped = Math.max(0, Math.min(100, Math.round(raw)));
        if (numberRef.current) {
          numberRef.current.textContent = clamped.toString().padStart(3, "0");
        }
        if (progressFillRef.current) {
          progressFillRef.current.style.width = `${clamped}%`;
        }
        if (statusRef.current) {
          statusRef.current.textContent = getStageLabel(clamped);
        }
      };

      // Ensure initial state is strictly 000%
      updateReadout(0);

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = prevOverflow || "auto";
          if (typeof window !== "undefined") {
            sessionStorage.setItem("visited", "true");
          }
          onCompleteRef.current();
        },
      });

      // Subtle entrance of HUD elements
      tl.fromTo(
        [topBarRef.current, bottomBarRef.current],
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
        0
      );

      tl.fromTo(
        hudRef.current,
        { opacity: 0, y: 16, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" },
        0
      );

      // Multi-stage smooth progression from 0% to 100% so it always loads in full
      tl.to(
        counter,
        {
          value: 42,
          duration: 0.65,
          ease: "power2.out",
          onUpdate: () => updateReadout(counter.value),
        },
        0.1
      )
        .to(counter, {
          value: 84,
          duration: 0.6,
          ease: "sine.inOut",
          onUpdate: () => updateReadout(counter.value),
        })
        .to(counter, {
          value: 100,
          duration: 0.5,
          ease: "power3.out",
          onUpdate: () => updateReadout(counter.value),
        });

      // Hold briefly at 100% so the full load state registers clearly
      tl.to({}, { duration: 0.25 });

      // Trigger Hero entrance animations right as the exit transition starts
      tl.call(() => {
        onReadyRef.current?.();
      });

      // Smoothly lift and fade out the HUD & metadata bars
      tl.to(
        [hudRef.current, topBarRef.current, bottomBarRef.current],
        {
          opacity: 0,
          y: -24,
          scale: 0.96,
          duration: 0.42,
          ease: "power3.inOut",
        },
        "exit"
      );

      tl.to(
        [seamRef.current, backdropGlowRef.current],
        {
          opacity: 0,
          duration: 0.35,
          ease: "power2.out",
        },
        "exit+=0.05"
      );

      // Silky architectural split-curtain reveal
      tl.to(
        leftDoorRef.current,
        {
          xPercent: -100,
          duration: 0.85,
          ease: "expo.inOut",
        },
        "exit+=0.18"
      );

      tl.to(
        rightDoorRef.current,
        {
          xPercent: 100,
          duration: 0.85,
          ease: "expo.inOut",
        },
        "exit+=0.18"
      );
    }, containerRef);

    return () => {
      document.body.style.overflow = prevOverflow || "auto";
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-testid="preloader"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-[9999] flex flex-col justify-between overflow-hidden select-none pointer-events-auto"
    >
      {/* Left Architectural Curtain */}
      <div
        ref={leftDoorRef}
        className="absolute top-0 left-0 w-1/2 h-full bg-[#0d0d10] will-change-transform"
      >
        <div className="absolute inset-y-0 left-1/3 w-px bg-white/[0.03]" />
        <div className="absolute inset-y-0 left-2/3 w-px bg-white/[0.03]" />
      </div>

      {/* Right Architectural Curtain */}
      <div
        ref={rightDoorRef}
        className="absolute top-0 right-0 w-1/2 h-full bg-[#0d0d10] will-change-transform"
      >
        <div className="absolute inset-y-0 left-1/3 w-px bg-white/[0.03]" />
        <div className="absolute inset-y-0 left-2/3 w-px bg-white/[0.03]" />
      </div>

      {/* Center Seam Line */}
      <div
        ref={seamRef}
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent pointer-events-none"
      />

      {/* Subtle Radial Studio Spotlight */}
      <div
        ref={backdropGlowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 48%, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.015) 35%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* Top Editorial Frame */}
      <div
        ref={topBarRef}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-6 sm:pt-8 flex items-center justify-between text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-white/50"
      >
        <span>Muhammad Rohan Sayyid</span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
          Portfolio
        </span>
      </div>

      {/* Center Counter & Progress HUD */}
      <div
        ref={hudRef}
        className="relative z-10 flex flex-col items-center justify-center px-6 my-auto"
      >
        {/* Dynamic Stage Label */}
        <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
          <span className="w-4 h-px bg-white/25" />
          <span
            ref={statusRef}
            className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.28em] text-white/65"
          >
            Initializing Environment
          </span>
          <span className="w-4 h-px bg-white/25" />
        </div>

        {/* Monumental Tabular Counter */}
        <div className="flex items-start justify-center leading-none">
          <span
            ref={numberRef}
            className="text-7xl sm:text-8xl md:text-[116px] font-sans font-black tracking-tighter tabular-nums text-white drop-shadow-[0_8px_32px_rgba(255,255,255,0.08)]"
          >
            000
          </span>
          <span className="text-xl sm:text-2xl md:text-3xl font-mono font-light text-white/50 mt-2 sm:mt-3 ml-1.5">
            %
          </span>
        </div>

        {/* Ultra-Clean Luminous Progress Track */}
        <div className="w-64 sm:w-80 mt-8 sm:mt-10">
          <div className="w-full h-[2px] bg-white/[0.12] overflow-hidden rounded-full relative">
            <div
              ref={progressFillRef}
              className="absolute top-0 left-0 h-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.9)] rounded-full"
              style={{ width: "0%" }}
            />
          </div>
          <div className="flex items-center justify-between mt-2.5 text-[9px] sm:text-[10px] font-mono tracking-[0.2em] text-white/35 uppercase">
            <span>00</span>
            <span>Full Stack Developer</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* Bottom Editorial Frame */}
      <div
        ref={bottomBarRef}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pb-6 sm:pb-8 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-white/35"
      >
        <span>Jakarta, ID</span>
        <span>Edition 2026</span>
      </div>
    </div>
  );
}

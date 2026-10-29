"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { heroData } from "@/content/hero";
import { useAppGlobal } from "@/components/ClientProviders";

export function HeroScene() {
  const containerRef = useRef<HTMLElement>(null);
  const { isReady } = useAppGlobal();

  useGSAP(
    () => {
      if (!isReady) return;

      const tl = gsap.timeline({ delay: 0.1 });

      tl.fromTo(
        ".hero-greeting",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(
          ".hero-name",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          ".hero-subtitle",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
          "-=0.5"
        );
    },
    { scope: containerRef, dependencies: [isReady] }
  );

  return (
    <section
      id="hero"
      ref={containerRef}
      aria-label="Hero introduction"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden bg-[#555555]"
    >
      {/* Full-bleed Monochrome Portrait Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <Image
          src="/images/profile.jpeg"
          alt={heroData.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_20%] scale-115 sm:scale-125 origin-[center_22%] grayscale contrast-[1.08] brightness-[0.58]"
        />
        {/* Studio vignette & contrast overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.52) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/50" />
      </div>

      {/* Centered Hero Typography */}
      <div className="z-10 text-center max-w-5xl mx-auto relative px-4 mt-6">
        <p className="hero-greeting font-sans font-extralight text-3xl sm:text-5xl md:text-[56px] text-white/95 tracking-normal leading-tight mb-1 md:mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
          {heroData.greeting}
        </p>

        <h1 className="hero-name font-sans font-black text-4xl sm:text-6xl md:text-7xl lg:text-[76px] text-white tracking-tight leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
          {heroData.name}
        </h1>

        <p className="hero-subtitle font-sans font-normal text-xs sm:text-sm md:text-[15px] uppercase tracking-[0.28em] text-white/80 mt-4 md:mt-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          {heroData.subtitle}
        </p>
      </div>
    </section>
  );
}

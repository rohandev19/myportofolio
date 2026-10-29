"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { heroData } from "@/content/hero";
import { useAppGlobal } from "@/components/ClientProviders";

export function HeroScene() {
  const containerRef = useRef<HTMLElement>(null);
  const { isReady } = useAppGlobal();

  const phrases = heroData.typedPhrases;
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState(phrases[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Looping typewriter animation when idle
  useEffect(() => {
    if (!isReady) return;

    const currentPhrase = phrases[phraseIndex];
    let timeoutDuration = isDeleting ? 45 : 85;

    if (!isDeleting && displayText === currentPhrase) {
      // Hold full text before starting backspace (longer hold on main name)
      timeoutDuration = phraseIndex === 0 ? 3200 : 2400;
      const holdTimer = setTimeout(() => {
        setIsDeleting(true);
      }, timeoutDuration);
      return () => clearTimeout(holdTimer);
    }

    if (isDeleting && displayText === "") {
      // Finished deleting, switch to next phrase after brief pause
      const nextTimer = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, 300);
      return () => clearTimeout(nextTimer);
    }

    const typeTimer = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting
          ? currentPhrase.slice(0, prev.length - 1)
          : currentPhrase.slice(0, prev.length + 1)
      );
    }, timeoutDuration);

    return () => clearTimeout(typeTimer);
  }, [displayText, isDeleting, phraseIndex, phrases, isReady]);

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
          className="object-cover object-[center_20%] scale-115 sm:scale-125 origin-[center_22%] grayscale contrast-[1.06] brightness-[0.68]"
        />
        {/* Studio vignette & contrast overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.42) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40" />
      </div>

      {/* Centered Hero Typography */}
      <div className="z-10 text-center max-w-5xl mx-auto relative px-2 sm:px-4 mt-6 w-full">
        <p className="hero-greeting font-sans font-extralight text-2xl sm:text-5xl md:text-[56px] text-white/95 tracking-normal leading-tight mb-1 md:mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
          {heroData.greeting}
        </p>

        <h1
          aria-label={heroData.name}
          className="hero-name min-h-[1.2em] flex items-center justify-center font-sans font-black text-[22px] sm:text-5xl md:text-7xl lg:text-[76px] text-white tracking-tight leading-[1.08] whitespace-nowrap drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
        >
          <span>{displayText}</span>
          <span
            aria-hidden="true"
            className="inline-block w-[2.5px] sm:w-[4px] h-[0.82em] bg-white/90 ml-1 sm:ml-2 animate-pulse"
          />
        </h1>

        <p className="hero-subtitle font-sans font-normal text-[10px] sm:text-sm md:text-[15px] uppercase tracking-[0.22em] sm:tracking-[0.28em] text-white/80 mt-3 sm:mt-4 md:mt-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          {heroData.subtitle}
        </p>
      </div>
    </section>
  );
}

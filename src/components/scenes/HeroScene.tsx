"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { heroData } from "@/content/hero";
import { SplitText } from "@/components/ui/SplitText";
import { useAppGlobal } from "@/components/ClientProviders";

export function HeroScene() {
  const containerRef = useRef<HTMLElement>(null);
  const { isReady } = useAppGlobal();

  useGSAP(
    () => {
      if (!isReady) return;

      const tl = gsap.timeline({ delay: 0.1 });

      // Animate the name first
      tl.fromTo(
        ".hero-name .char",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.8, ease: "back.out(1.7)" }
      )
        // Then the title
        .fromTo(
          ".hero-title .char",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.02, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        )
        // Then the tagline
        .fromTo(
          ".hero-tagline",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.2"
        )
        // Finally the CTA buttons
        .fromTo(
          ".hero-cta",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
          "-=0.4"
        );
    },
    { scope: containerRef, dependencies: [isReady] }
  );

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden"
    >
      <div className="z-10 text-center max-w-4xl">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tighter">
          <SplitText className="hero-name text-[#F8FAFC]" charClassName="char">
            {heroData.name}
          </SplitText>
        </h1>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-[#38BDF8]">
          <SplitText className="hero-title" charClassName="char">
            {heroData.title}
          </SplitText>
        </h2>

        <p className="hero-tagline text-lg md:text-xl text-[#94A3B8] mb-10 max-w-2xl mx-auto opacity-0">
          {heroData.tagline}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#projects"
            className="hero-cta opacity-0 px-8 py-3 bg-[#38BDF8] text-[#070B14] font-semibold rounded-lg hover:bg-[#818CF8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#818CF8]"
          >
            {heroData.cta.primary}
          </a>
          <a
            href="#contact"
            className="hero-cta opacity-0 px-8 py-3 bg-transparent border border-[#38BDF8] text-[#38BDF8] font-semibold rounded-lg hover:bg-[#0F172A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#818CF8]"
          >
            {heroData.cta.secondary}
          </a>
        </div>
      </div>

      {/* Background ambient element placeholder */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-[#070B14] opacity-50" />
    </section>
  );
}

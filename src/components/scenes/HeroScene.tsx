"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { heroData } from "@/content/hero";
import { SplitText } from "@/components/ui/SplitText";
import { InteractiveButton } from "../ui/InteractiveButton";
import { useAppGlobal } from "@/components/ClientProviders";
import Lottie from "lottie-react";
import ReactDOM from "react-dom";

export function HeroScene() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { isReady } = useAppGlobal();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animationData, setAnimationData] = useState<any>(null);

  // Preload critical asset
  if (typeof window === "undefined") {
    ReactDOM.preload("/waving-baymax.json", { as: "fetch", crossOrigin: "anonymous" });
  }

  useEffect(() => {
    fetch("/waving-baymax.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Error loading Baymax animation:", err));
  }, []);

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
          "-=0.8"
        );
    },
    { scope: containerRef, dependencies: [isReady] }
  );

  return (
    <section
      id="hero"
      ref={containerRef}
      aria-label="Hero introduction"
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden"
    >
      <div className="z-10 text-center max-w-4xl relative">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tighter relative z-10">
          <SplitText
            className="hero-name"
            charClassName="char bg-clip-text text-transparent bg-gradient-to-b from-[var(--color-text-primary)] to-[var(--color-text-secondary)]"
          >
            {heroData.name}
          </SplitText>
        </h1>

        <div className="relative inline-block">
          {/* Robot Element (Hidden for now) */}
          <div className="hidden absolute bottom-[30%] -right-20 md:-right-36 lg:-right-48 w-32 h-40 md:w-48 md:h-56 robot-container -z-10 origin-bottom pointer-events-none">
            {animationData && (
              <Lottie
                animationData={animationData}
                loop={true}
                className="w-full h-full drop-shadow-[0_10px_20px_rgba(56,189,248,0.3)]"
              />
            )}
          </div>
          <h2
            ref={titleRef}
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 relative z-10 origin-left inline-block"
          >
            <SplitText
              className="hero-title"
              charClassName="char bg-clip-text text-transparent bg-gradient-to-br from-[var(--color-text-primary)] to-[var(--color-text-secondary)]"
            >
              {heroData.title}
            </SplitText>
          </h2>
        </div>

        <p className="hero-tagline text-lg md:text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto opacity-0">
          {heroData.tagline}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <InteractiveButton
            as="a"
            href="#projects"
            className="hero-cta opacity-0 px-8 py-3 bg-[var(--color-accent-blue)] text-[var(--color-bg-primary)] font-bold rounded-lg hover:opacity-90 hover:shadow-[0_0_30px_rgba(212,216,224,0.3)] hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)]"
          >
            {heroData.cta.primary}
          </InteractiveButton>
          <InteractiveButton
            as="a"
            href="#contact"
            className="hero-cta opacity-0 px-8 py-3 bg-[var(--color-bg-secondary)]/50 backdrop-blur-md border border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-border)]"
          >
            {heroData.cta.secondary}
          </InteractiveButton>
          <InteractiveButton
            as="a"
            href="/blog"
            className="hero-cta opacity-0 px-8 py-3 bg-[var(--color-bg-secondary)]/50 backdrop-blur-md border border-[var(--color-accent-violet)]/40 text-[var(--color-accent-violet)] font-semibold rounded-lg hover:bg-[var(--color-accent-violet)]/10 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-violet)]"
          >
            Read Blog
          </InteractiveButton>
          <InteractiveButton
            as="a"
            href="/CV/CV_Muhammad_Rohan_Sayyid_FullstackDeveloper_EN.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-cta opacity-0 px-8 py-3 bg-[var(--color-bg-secondary)]/50 backdrop-blur-md border border-[var(--color-accent-cyan)]/40 text-[var(--color-accent-blue)] font-semibold rounded-lg hover:bg-[var(--color-accent-blue)]/10 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)]"
          >
            Download CV
          </InteractiveButton>
        </div>
      </div>

      {/* Background ambient glows and grid */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-[var(--color-bg-primary)] opacity-80 pointer-events-none" />
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-[500px] md:h-[500px] bg-[#1A4A4E]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-[600px] md:h-[600px] bg-[#7B8794]/8 rounded-full blur-[150px] pointer-events-none -z-10" />
    </section>
  );
}

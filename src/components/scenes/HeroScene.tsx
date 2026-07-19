"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { heroData } from "@/content/hero";
import { SplitText } from "@/components/ui/SplitText";
import { InteractiveButton } from "../ui/InteractiveButton";
import { useAppGlobal } from "@/components/ClientProviders";
import Lottie from "lottie-react";

export function HeroScene() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { isReady } = useAppGlobal();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animationData, setAnimationData] = useState<any>(null);

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
        // Robot Drops!
        .fromTo(
          ".robot-container",
          { y: -300, opacity: 0, rotate: -20 },
          { y: 0, opacity: 1, rotate: 0, duration: 1.2, ease: "bounce.out" },
          "-=0.2"
        )
        // When robot lands (bounces), tilt the text
        .to(
          titleRef.current,
          { rotateZ: 3, y: 10, duration: 1.5, ease: "elastic.out(1, 0.3)" },
          "<0.4"
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
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden"
    >
      <div className="z-10 text-center max-w-4xl relative">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tighter relative z-10">
          <SplitText className="hero-name text-[#F8FAFC]" charClassName="char">
            {heroData.name}
          </SplitText>
        </h1>

        <div className="relative inline-block">
          {/* Robot Element */}
          <div className="absolute bottom-[30%] -right-20 md:-right-36 lg:-right-48 w-32 h-40 md:w-48 md:h-56 robot-container -z-10 origin-bottom pointer-events-none">
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
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-[#38BDF8] relative z-10 origin-left inline-block"
          >
            <SplitText className="hero-title" charClassName="char">
              {heroData.title}
            </SplitText>
          </h2>
        </div>

        <p className="hero-tagline text-lg md:text-xl text-[#94A3B8] mb-10 max-w-2xl mx-auto opacity-0">
          {heroData.tagline}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <InteractiveButton
            as="a"
            href="#projects"
            className="hero-cta opacity-0 px-8 py-3 bg-[#38BDF8] text-[#070B14] font-semibold rounded-lg hover:bg-[#818CF8] focus:outline-none focus:ring-2 focus:ring-[#818CF8]"
          >
            {heroData.cta.primary}
          </InteractiveButton>
          <InteractiveButton
            as="a"
            href="#contact"
            className="hero-cta opacity-0 px-8 py-3 bg-transparent border border-[#38BDF8] text-[#38BDF8] font-semibold rounded-lg hover:bg-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#818CF8]"
          >
            {heroData.cta.secondary}
          </InteractiveButton>
        </div>
      </div>

      {/* Background ambient element placeholder */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-[#070B14] opacity-50" />
    </section>
  );
}

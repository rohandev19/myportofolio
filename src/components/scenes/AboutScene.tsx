"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { aboutData } from "@/content/about";
import { InteractiveButton } from "../ui/InteractiveButton";

export function AboutScene() {
  const containerRef = useRef<HTMLElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animation for text content
      gsap.fromTo(
        ".about-text",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      aria-label="About me"
      className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-6 lg:px-12 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center z-10">
        {/* Left Col: Text */}
        <div className="order-2 lg:order-1 flex flex-col gap-6">
          <h2 className="about-text text-4xl md:text-5xl font-bold text-[#f0f1f4]">About Me</h2>
          <div className="flex flex-col gap-4 text-lg text-[#D4D8E0] font-medium leading-relaxed drop-shadow-sm">
            {aboutData.paragraphs.map((p, i) => (
              <p key={i} className="about-text">
                {p}
              </p>
            ))}
          </div>

          <ul className="mt-4 flex flex-col gap-3">
            {aboutData.highlights.map((highlight, i) => (
              <li key={i} className="about-text flex items-center gap-3">
                <span className="w-2 h-2 min-w-[8px] rounded-full bg-[var(--color-accent-blue)]" />
                <span className="text-[#f0f1f4] font-medium">{highlight}</span>
              </li>
            ))}
          </ul>

          <div className="about-text mt-8">
            <InteractiveButton
              as="a"
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-transparent text-[#D4D8E0] font-bold rounded-xl border-2 border-[#D4D8E0]/30 hover:border-[#D4D8E0] hover:bg-[#D4D8E0]/10 hover:shadow-[0_0_20px_rgba(212,216,224,0.3)] transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#D4D8E0]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              Download CV
            </InteractiveButton>
          </div>
        </div>

        {/* Right Col: Visual Blob with Profile Image */}
        <div className="order-1 lg:order-2 flex items-center justify-center relative min-h-[300px] lg:min-h-[500px]">
          {/* Glowing background blob */}
          <div
            ref={blobRef}
            className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-tr from-[#1A4A4E] to-[#7B8794] opacity-60 mix-blend-screen filter blur-3xl absolute animate-morph"
          />
          {/* Foreground morphing container for the image */}
          <div
            className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-bl from-[#141418] to-[#222228] border border-[#1A4A4E]/50 absolute overflow-hidden shadow-[0_0_30px_rgba(26,74,78,0.3)] animate-morph group cursor-pointer"
            onClick={() => setIsActive(!isActive)}
          >
            {/* Dark overlay to match theme (Duotone effect) */}
            <div
              className={`absolute inset-0 bg-[#141418]/40 mix-blend-multiply z-10 transition-colors duration-500 group-hover:bg-transparent ${isActive ? "bg-transparent" : ""}`}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1A4A4E]/20 mix-blend-overlay z-10" />

            <img
              src="/images/profile.jpeg"
              alt="Profile"
              className={`w-full h-full object-cover object-top filter transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-100 ${
                isActive ? "grayscale-0 opacity-100 scale-100" : "grayscale opacity-90 scale-110"
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

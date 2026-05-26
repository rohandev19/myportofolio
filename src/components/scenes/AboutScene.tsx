"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { aboutData } from "@/content/about";
import { InteractiveButton } from "../ui/InteractiveButton";

export function AboutScene() {
  const containerRef = useRef<HTMLElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

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
      className="min-h-screen w-full flex items-center justify-center py-20 px-6 lg:px-12 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center z-10">
        {/* Left Col: Text */}
        <div className="order-2 lg:order-1 flex flex-col gap-6">
          <h2 className="about-text text-4xl md:text-5xl font-bold text-[#F8FAFC]">About Me</h2>
          <div className="flex flex-col gap-4 text-lg text-[#94A3B8] leading-relaxed">
            {aboutData.paragraphs.map((p, i) => (
              <p key={i} className="about-text">
                {p}
              </p>
            ))}
          </div>

          <ul className="mt-4 flex flex-col gap-3">
            {aboutData.highlights.map((highlight, i) => (
              <li key={i} className="about-text flex items-center gap-3">
                <span className="w-2 h-2 min-w-[8px] rounded-full bg-[#38BDF8]" />
                <span className="text-[#F8FAFC] font-medium">{highlight}</span>
              </li>
            ))}
          </ul>

          <div className="about-text mt-8">
            <InteractiveButton
              as="a"
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E293B] text-[#F8FAFC] font-medium rounded-lg hover:bg-[#38BDF8] hover:text-[#070B14] transition-colors focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
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

        {/* Right Col: Visual Blob */}
        <div className="order-1 lg:order-2 flex items-center justify-center relative min-h-[300px] lg:min-h-[500px]">
          <div
            ref={blobRef}
            className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-tr from-[#38BDF8] to-[#818CF8] opacity-80 mix-blend-screen filter blur-3xl absolute animate-morph"
          />
          <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-bl from-[#0F172A] to-transparent border border-[#38BDF8]/30 absolute backdrop-blur-sm animate-morph">
            {/* Optional inner content for the blob like a photo or geometric pattern */}
          </div>
        </div>
      </div>
    </section>
  );
}

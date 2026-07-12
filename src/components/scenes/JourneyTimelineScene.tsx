"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { timelineData } from "@/content/timeline";

export function JourneyTimelineScene() {
  const containerRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the main timeline line
      gsap.fromTo(
        lineRef.current,
        { height: 0 },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            end: "bottom 80%",
            scrub: 1, // Smooth scrubbing effect
          },
        }
      );

      // Animate each timeline entry
      gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="timeline"
      ref={containerRef}
      className="min-h-screen w-full py-24 px-4 md:px-8 bg-[#0F172A] relative"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-[#F8FAFC] mb-20">
          Where I&apos;ve Been
        </h2>

        <div className="relative">
          {/* Central Line Background */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#1E293B] -translate-x-1/2" />

          {/* Animated Highlight Line */}
          <div
            ref={lineRef}
            className="absolute left-4 md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-[#38BDF8] to-[#818CF8] -translate-x-1/2 origin-top"
          />

          <div className="flex flex-col gap-12">
            {timelineData.map((entry, idx) => (
              <div
                key={entry.id}
                className={`timeline-item flex flex-col md:flex-row gap-8 relative z-10 ${
                  idx % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Node */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-[#070B14] border-2 border-[#38BDF8] -translate-x-1/2 mt-1.5" />

                {/* Content Side */}
                <div
                  className={`w-full md:w-1/2 pl-12 md:pl-0 ${idx % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}
                >
                  <div className="text-[#38BDF8] font-mono text-sm font-bold mb-2">
                    {entry.year}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#F8FAFC] mb-1">
                    {entry.role}
                  </h3>
                  <div className="text-[#818CF8] font-medium mb-3">{entry.company}</div>
                  <p className="text-[#94A3B8] leading-relaxed">{entry.description}</p>
                </div>

                {/* Empty Side for Spacing */}
                <div className="hidden md:block w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

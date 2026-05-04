"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { principlesData } from "@/content/principles";

export function PhilosophyScene() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".principle-card",
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
      id="philosophy"
      ref={containerRef}
      className="w-full py-24 px-4 md:px-8 bg-[#0F172A] relative"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#F8FAFC] mb-4">
            Engineering Philosophy
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">
            Core principles that guide my approach to software engineering and problem-solving.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {principlesData.map((principle) => (
            <div
              key={principle.id}
              className="principle-card bg-[#070B14] border border-[#1E293B] rounded-2xl p-8 hover:border-[#38BDF8]/50 transition-colors group"
            >
              <div className="text-4xl mb-6 text-[#38BDF8] group-hover:scale-110 transition-transform origin-left">
                {principle.icon}
              </div>
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-4">{principle.title}</h3>
              <p className="text-[#94A3B8] leading-relaxed">{principle.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { showcaseData } from "@/content/showcase";

export function ShowcaseScene() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".showcase-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="showcase" ref={containerRef} className="w-full py-24 px-4 md:px-8 bg-[#070B14]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#F8FAFC] mb-4">Showcase</h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">
            Selected projects demonstrating my engineering capabilities and focus on user
            experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcaseData.map((project, idx) => (
            <div
              key={project.id}
              className="showcase-card group relative bg-[#0F172A] rounded-2xl overflow-hidden border border-[#1E293B] hover:border-[#38BDF8]/50 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
            >
              {/* Image Container / Placeholder */}
              <div className="relative h-48 w-full bg-gradient-to-tr from-[#1E293B] to-[#0F172A] overflow-hidden">
                {project.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity duration-500">
                    <span className="text-6xl font-black text-[#38BDF8]">{idx + 1}</span>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-[#070B14]/80 backdrop-blur-md border border-[#38BDF8]/30 rounded-full text-xs font-bold text-[#38BDF8] uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-[#F8FAFC] mb-2 group-hover:text-[#38BDF8] transition-colors">
                  {project.title}
                </h3>
                <div className="text-[#818CF8] font-medium mb-4 text-sm">Role: {project.role}</div>

                <div className="flex-grow">
                  <ul className="flex flex-col gap-2 mb-6">
                    {project.impact.map((item, i) => (
                      <li key={i} className="text-[#94A3B8] text-sm flex items-start gap-2">
                        <span className="text-[#38BDF8] mt-1">▹</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#1E293B]/50 flex justify-between items-center mt-auto">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#38BDF8] font-semibold hover:text-[#F8FAFC] transition-colors flex items-center gap-1"
                    >
                      View Project <span>→</span>
                    </a>
                  )}
                  {/* Subtle indicator for details */}
                  <div className="w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center group-hover:bg-[#38BDF8] transition-colors">
                    <svg
                      className="w-4 h-4 text-[#F8FAFC]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

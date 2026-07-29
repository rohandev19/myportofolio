"use client";

/**
 * Showcase Scene
 *
 * Project portfolio with category filtering, URL state sync,
 * and GSAP flip/stagger animations for smooth layout transitions.
 */

import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import Image from "next/image";
import Link from "next/link";
import { rgbDataURL } from "@/lib/utils/image";
import { showcaseData, showcaseCategories, type ProjectCategory } from "@/content/showcase";
import { TiltCard } from "../ui/TiltCard";

// Register Flip plugin for layout transitions
if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

function ShowcaseContent() {
  const containerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filter from URL, default to "All"
  const urlFilter = searchParams.get("filter") as ProjectCategory | null;
  const initialFilter = showcaseCategories.includes(urlFilter as ProjectCategory)
    ? (urlFilter as ProjectCategory)
    : "All";

  const [activeFilter, setActiveFilter] = useState<ProjectCategory>(initialFilter);

  // Sync URL when filter changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeFilter === "All") {
      params.delete("filter");
    } else {
      params.set("filter", activeFilter);
    }

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  }, [activeFilter, router, searchParams]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return showcaseData;
    return showcaseData.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  // Initial reveal animation
  useGSAP(
    () => {
      gsap.fromTo(
        ".showcase-card",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        }
      );
    },
    { scope: containerRef }
  );

  // Layout transition when filter changes
  useGSAP(
    () => {
      if (!gridRef.current) return;

      // Get state before layout change
      const state = Flip.getState(".showcase-card-wrapper");

      // We use a microtask to let React render the DOM changes first
      // Since GSAP's useGSAP hook runs synchronously after render, we can just call Flip.from
      Flip.from(state, {
        duration: 0.5,
        ease: "power3.inOut",
        scale: true,
        absolute: true, // Prevents layout jumping during animation
        stagger: 0.05,
        onEnter: (elements) => {
          return gsap.fromTo(
            elements,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
          );
        },
        onLeave: (elements) => {
          return gsap.to(elements, {
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: "power2.in",
          });
        },
      });
    },
    { dependencies: [activeFilter], scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="w-full py-24 px-4 md:px-8 bg-[var(--color-bg-secondary)] relative"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            Showcase
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
            Selected projects demonstrating my engineering capabilities and focus on user
            experience.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {showcaseCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-secondary)] ${
                activeFilter === category
                  ? "bg-[var(--color-accent-blue)] text-[var(--color-bg-primary)] border-[var(--color-accent-blue)] shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                  : "bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-accent-blue)]/50 hover:text-[var(--color-text-primary)]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[500px]"
        >
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              className="showcase-card-wrapper h-full"
              data-flip-id={project.id}
            >
              <TiltCard className="showcase-card group bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-accent-blue)]/50 flex flex-col h-full overflow-hidden focus-within:ring-2 focus-within:ring-[var(--color-accent-blue)]">
                {/* Image Container / Placeholder */}
                <div className="relative h-56 w-full bg-gradient-to-tr from-[var(--color-bg-secondary)] to-[var(--color-bg-primary)] overflow-hidden">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      placeholder="blur"
                      blurDataURL={rgbDataURL(15, 23, 42)} // slate-900 approximation
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity duration-500 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay">
                      <span className="text-6xl font-black text-[var(--color-accent-blue)] opacity-50">
                        {idx + 1}
                      </span>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-[var(--color-bg-primary)]/80 backdrop-blur-md border border-[var(--color-accent-blue)]/30 rounded-full text-xs font-bold text-[var(--color-accent-blue)] uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3 py-1 bg-[var(--color-accent-violet)]/20 backdrop-blur-md border border-[var(--color-accent-violet)]/30 rounded-full text-xs font-bold text-[var(--color-accent-violet)] uppercase tracking-wider flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow relative">
                  <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent-blue)] transition-colors">
                    {project.title}
                  </h3>
                  <div className="text-[var(--color-accent-violet)] font-medium mb-4 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {project.role}
                  </div>

                  <div className="flex-grow">
                    <ul className="flex flex-col gap-2 mb-6">
                      {project.impact.map((item, i) => (
                        <li
                          key={i}
                          className="text-[var(--color-text-secondary)] text-sm flex items-start gap-2"
                        >
                          <span className="text-[var(--color-accent-blue)] mt-1">▹</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)] text-xs font-medium rounded-md border border-[var(--color-border)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[var(--color-border)] flex justify-between items-center">
                    <div className="flex gap-4">
                      {project.slug && (
                        <Link
                          href={`/projects/${project.slug}`}
                          className="text-[var(--color-accent-blue)] font-semibold hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1 focus:outline-none"
                        >
                          Case Study <span>↗</span>
                        </Link>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${project.slug ? "text-[var(--color-text-secondary)]" : "text-[var(--color-accent-blue)]"} font-semibold hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1 focus:outline-none`}
                        >
                          View Site <span>↗</span>
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1 focus:outline-none"
                          aria-label="View source on GitHub"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            />
                          </svg>
                        </a>
                      )}
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center group-hover:bg-[var(--color-accent-blue)] transition-colors text-[var(--color-text-secondary)] group-hover:text-[var(--color-bg-primary)]">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ShowcaseScene() {
  return (
    <div id="projects" className="w-full">
      <Suspense
        fallback={<div className="w-full h-screen bg-[var(--color-bg-secondary)] animate-pulse" />}
      >
        <ShowcaseContent />
      </Suspense>
    </div>
  );
}

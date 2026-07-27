/**
 * Case Study Detail Page
 *
 * Displays a full project case study including Problem/Solution/Impact/Results,
 * Image Gallery, Tech Stack, Testimonials, and GitHub Stats.
 * Uses ISR for caching.
 */

import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { getCaseStudy, getCaseStudySlugs, getAllCaseStudies } from "@/lib/case-study/data";
import { getRelatedProjects } from "@/lib/case-study/related";

import { CaseStudySection } from "@/components/case-study/CaseStudySection";
import { ImageGallery } from "@/components/case-study/ImageGallery";
import { TechStackBreakdown } from "@/components/case-study/TechStackBreakdown";
import { Testimonials } from "@/components/case-study/Testimonials";
import { GitHubStatsCard } from "@/components/case-study/GitHubStatsCard";
import { SocialShare } from "@/components/case-study/SocialShare";
import { RelatedProjects } from "@/components/case-study/RelatedProjects";

export const revalidate = 3600; // 1 hour ISR

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = getCaseStudy(slug);
    return {
      title: `${project.title} | Case Study`,
      description: project.description,
      openGraph: {
        title: project.title,
        description: project.description,
        type: "article",
        publishedTime: project.publishedAt,
        tags: project.tags,
      },
    };
  } catch {
    return { title: "Project Not Found" };
  }
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  let project;

  try {
    project = getCaseStudy(slug);
  } catch {
    notFound();
  }

  const allProjects = getAllCaseStudies();
  const related = getRelatedProjects(project, allProjects, 3);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 md:pt-32 md:pb-20">
      {/* Header */}
      <header className="mb-16 text-center">
        <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-[var(--color-accent-cyan)] uppercase bg-[var(--color-accent-cyan)]/10 rounded-full border border-[var(--color-accent-cyan)]/20">
          {project.category}
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          {project.title}
        </h1>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          {project.description}
        </p>

        {/* Project Meta info */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-slate-300">
          {project.role && (
            <div className="flex flex-col items-center">
              <span className="text-slate-500 mb-1 text-xs uppercase tracking-wider">Role</span>
              <span className="font-medium">{project.role}</span>
            </div>
          )}
          {project.client && (
            <div className="flex flex-col items-center">
              <span className="text-slate-500 mb-1 text-xs uppercase tracking-wider">Client</span>
              <span className="font-medium">{project.client}</span>
            </div>
          )}
          <div className="flex flex-col items-center">
            <span className="text-slate-500 mb-1 text-xs uppercase tracking-wider">Year</span>
            <span className="font-medium">{new Date(project.publishedAt).getFullYear()}</span>
          </div>
        </div>

        {/* Action Links */}
        {(project.links.live || project.links.github) && (
          <div className="flex items-center justify-center gap-4 mt-10">
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#E2E8F0] to-[#CBD5E1] text-[#070B14] font-bold shadow-[0_0_15px_rgba(226,232,240,0.3)] hover:shadow-[0_0_25px_rgba(226,232,240,0.6)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative z-10 flex items-center gap-2">
                  Visit Live Site
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              </a>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border-2 border-[#1E293B] bg-[#070B14] text-[#E2E8F0] font-semibold hover:border-[#E2E8F0]/50 hover:bg-[#1E293B]/50 transition-all duration-300 hover:-translate-y-1"
              >
                View Source
              </a>
            )}
          </div>
        )}

        {/* GitHub Stats */}
        {project.links.github && (
          <div className="flex justify-center mt-2">
            <GitHubStatsCard githubUrl={project.links.github} />
          </div>
        )}
      </header>

      {/* Hero Cover Image */}
      {project.coverImage && (
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 mb-20 shadow-2xl">
          <Image
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>
      )}

      {/* Main Content Sections */}
      <div className="space-y-20">
        <CaseStudySection section={project.sections.problem} id="problem" />
        <CaseStudySection section={project.sections.solution} id="solution" />

        <TechStackBreakdown techStack={project.techStack} />

        <CaseStudySection section={project.sections.impact} id="impact" />
        <CaseStudySection section={project.sections.results} id="results" />

        <ImageGallery images={project.images} />

        <Testimonials testimonials={project.testimonials} />
      </div>

      <SocialShare title={project.title} />

      <RelatedProjects projects={related} />
    </article>
  );
}

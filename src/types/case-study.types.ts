/**
 * Case Study Types
 *
 * Types for project case study pages with
 * Problem → Solution → Impact → Results format.
 */

export type TechCategory =
  "Frontend" | "Backend" | "Database" | "DevOps" | "Mobile" | "Testing" | "Other";

export interface CaseStudyImage {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface TechStackItem {
  name: string;
  category: TechCategory;
  explanation?: string;
  icon?: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  photo?: string;
}

export interface GitHubStats {
  stars: number;
  forks: number;
  openIssues: number;
  lastCommitDate: string; // ISO 8601
  watchers?: number;
}

export interface CaseStudySection {
  title: string;
  content: string; // Markdown content
}

export interface CaseStudy {
  slug: string;
  title: string;
  description: string;
  category: string;
  role: string;
  client?: string;
  publishedAt: string; // ISO 8601
  updatedAt?: string;
  coverImage?: CaseStudyImage;
  sections: {
    problem: CaseStudySection;
    solution: CaseStudySection;
    impact: CaseStudySection;
    results: CaseStudySection;
  };
  techStack: TechStackItem[];
  images: CaseStudyImage[];
  testimonials: Testimonial[];
  tags: string[];
  links: {
    live?: string;
    github?: string;
    demo?: string;
  };
  githubStats?: GitHubStats;
  featured: boolean;
}

export interface RelatedProject {
  slug: string;
  title: string;
  description: string;
  category: string;
  coverImage?: CaseStudyImage;
  techStack: string[];
  tags: string[];
}

/**
 * Showcase Content & Types
 */

export type ProjectCategory = "All" | "Web" | "Mobile" | "System" | "Open Source";

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  role: string;
  impact: string[];
  image?: string;
  link?: string;
  github?: string;
  slug?: string;
  techStack: string[];
  featured?: boolean;
}

export const showcaseData: Project[] = [
  {
    id: "project-1",
    title: "Enterprise Digital Platform (Multi Kreasi Printing)",
    category: "System",
    role: "Lead / Full-Stack Developer",
    impact: [
      "Designed robust backend with NestJS and PostgreSQL",
      "Implemented async processing using Redis and BullMQ",
      "Built scalable frontend with React.js and TypeScript"
    ],
    slug: "multi-kreasi-printing",
    techStack: ["React", "NestJS", "TypeScript", "PostgreSQL", "Redis", "Docker"],
    featured: true,
  },
  {
    id: "project-2",
    title: "Hamada Operations Platform",
    category: "System",
    role: "Full-Stack Developer",
    impact: [
      "Offline-first mobile synchronization with Sembast",
      "Predictive vehicle maintenance scheduling",
      "QR Code & GPS attendance tracking",
    ],
    link: "https://operation.hamada-logistic.com",
    slug: "hamada-logistic",
    techStack: ["Laravel", "Flutter", "MySQL", "Firebase", "Sanctum"],
    featured: true,
  },
  {
    id: "project-3",
    title: "Vendor SLA & Incident Management",
    category: "System",
    role: "Backend Developer",
    impact: [
      "High-performance Go backend for enterprise operations",
      "Automated Service Level Agreement (SLA) tracking",
      "Lightweight Server-Side Rendering (SSR) with Templ",
    ],
    slug: "vendor-sla-incident",
    techStack: ["Go", "PostgreSQL", "Chi", "Templ"],
    featured: false,
  },
  {
    id: "project-4",
    title: "Transporter Cost Analytics",
    category: "Web",
    role: "Frontend Developer",
    impact: [
      "Interactive cost data visualization",
      "Responsive data tables and charts",
      "Optimized complex state management",
    ],
    slug: "transporter-cost-analytics",
    techStack: ["React", "TypeScript", "Recharts", "Zustand", "TailwindCSS"],
    featured: false,
  },
];

export const showcaseCategories: ProjectCategory[] = [
  "All",
  "Web",
  "Mobile",
  "System",
  "Open Source",
];

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
  techStack: string[];
  featured?: boolean;
}

export const showcaseData: Project[] = [
  {
    id: "project-1",
    title: "Hamada Operations Platform",
    category: "System",
    role: "Full-Stack Developer",
    impact: [
      "Offline-first mobile synchronization",
      "Predictive vehicle maintenance",
      "QR Code & GPS attendance tracking",
    ],
    link: "https://operation.hamada-logistic.com",
    techStack: ["Next.js", "React Native", "PostgreSQL", "Prisma"],
    featured: true,
  },
  {
    id: "project-2",
    title: "EcoTrack Mobile App",
    category: "Mobile",
    role: "Lead Mobile Developer",
    impact: [
      "Real-time carbon footprint calculation",
      "Interactive gamification system",
      "Offline cache for rural areas",
    ],
    techStack: ["React Native", "Zustand", "Firebase", "Google Maps API"],
    featured: true,
  },
  {
    id: "project-3",
    title: "DeFi Analytics Dashboard",
    category: "Web",
    role: "Frontend Engineer",
    impact: [
      "Sub-second real-time market data rendering",
      "Complex financial charting (D3.js)",
      "Web3 wallet integration",
    ],
    techStack: ["React", "TypeScript", "D3.js", "Ethers.js"],
  },
  {
    id: "project-4",
    title: "Next.js UI Kit",
    category: "Open Source",
    role: "Creator & Maintainer",
    impact: [
      "1,000+ GitHub stars",
      "Fully accessible component library",
      "Zero-config installation",
    ],
    github: "https://github.com/rohandev19",
    techStack: ["React", "Tailwind CSS", "Framer Motion", "Radix UI"],
  },
  {
    id: "project-5",
    title: "HealthTech Patient Portal",
    category: "Web",
    role: "Full-Stack Developer",
    impact: [
      "HIPAA compliant architecture",
      "End-to-end encrypted messaging",
      "Telehealth video integration",
    ],
    techStack: ["Next.js", "Node.js", "WebRTC", "Socket.io"],
  },
];

export const showcaseCategories: ProjectCategory[] = [
  "All",
  "Web",
  "Mobile",
  "System",
  "Open Source",
];

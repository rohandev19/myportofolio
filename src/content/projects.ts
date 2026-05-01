import { Project } from "@/types";

export const projectsData: Project[] = [
  {
    id: "project-1",
    title: "E-Commerce Platform",
    description: "A highly scalable e-commerce platform built with modern technologies, featuring seamless payment integration and real-time inventory management.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Redis"],
    links: {
      github: "https://github.com",
      live: "https://example.com"
    },
    metrics: [
      { label: "Lighthouse Score", value: "100" },
      { label: "Uptime", value: "99.99%" }
    ]
  },
  {
    id: "project-2",
    title: "Analytics Dashboard",
    description: "A comprehensive analytics dashboard for visualizing complex data sets, built for performance and accessibility.",
    tech: ["React", "Laravel", "MySQL", "Chart.js"],
    links: {
      github: "https://github.com"
    },
    metrics: [
      { label: "Data Points Processed", value: "1M+" },
      { label: "Load Time", value: "<1s" }
    ]
  }
];

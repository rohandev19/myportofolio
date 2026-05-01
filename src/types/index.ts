export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  links: {
    github?: string;
    live?: string;
  };
  metrics?: ProjectMetric[];
  image?: string; // fallback if needed
}

export interface TimelineEntry {
  id: string;
  year: string;
  role: string;
  company: string;
  description: string;
}

export interface RoadmapGoal {
  id: string;
  title: string;
  timeframe: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
}

export interface Principle {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface TechStackTier {
  primary: string[];
  secondary: string[];
  ambient: string[];
}

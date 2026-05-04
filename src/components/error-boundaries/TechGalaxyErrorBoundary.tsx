"use client";

import { Component, ReactNode } from "react";
import { techStackData } from "@/content/techstack";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class TechGalaxyErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("WebGL 3D Scene Error:", error);
    // Here we could also log to Sentry if it was configured
  }

  render() {
    if (this.state.hasError) {
      // Fallback Static UI when WebGL fails
      return (
        <section id="tech-stack" className="w-full py-24 px-4 md:px-8 bg-[#070B14]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-[#F8FAFC] mb-12">Tech Stack</h2>
            <div className="mb-12">
              <h3 className="text-[#38BDF8] text-xl font-bold mb-6">Primary</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {techStackData.primary.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-[#0F172A] border border-[#38BDF8]/30 rounded-lg text-[#F8FAFC]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-[#818CF8] text-xl font-bold mb-6">Secondary & Tools</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {techStackData.secondary.concat(techStackData.ambient).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-[#0F172A]/50 border border-[#818CF8]/20 rounded-md text-[#94A3B8] text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

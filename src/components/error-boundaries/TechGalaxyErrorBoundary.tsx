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
        <section id="tech-stack" className="w-full py-24 px-4 md:px-8 bg-[#141418]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-[#f0f1f4] mb-12">Tech Stack</h2>
            <div className="mb-12">
              <h3 className="text-[#D4D8E0] text-xl font-bold mb-6">Primary</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {techStackData.primary.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-[#1a1a20] border border-[#D4D8E0]/30 rounded-lg text-[#f0f1f4]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-[#7B8794] text-xl font-bold mb-6">Secondary & Tools</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {techStackData.secondary.concat(techStackData.ambient).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-[#1a1a20]/50 border border-[#7B8794]/20 rounded-md text-[#7B8794] text-sm"
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

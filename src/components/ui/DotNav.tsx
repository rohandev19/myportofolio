"use client";

import { useEffect, useState } from "react";

// Initial simple dot navigation.
// Will be expanded with ScrollTrigger logic in later phases.
const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "timeline", label: "Journey" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export function DotNav() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    // Simple intersection observer for now
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Section Navigation"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4"
    >
      {SECTIONS.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollTo(section.id)}
          aria-label={`Scroll to ${section.label}`}
          title={section.label}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            activeSection === section.id
              ? "bg-[#38BDF8] scale-125"
              : "bg-[#94A3B8] hover:bg-[#F8FAFC]"
          }`}
        />
      ))}
    </nav>
  );
}

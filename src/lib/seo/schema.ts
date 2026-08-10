export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rohan",
    url: "https://rohandev19.github.io",
    jobTitle: " Full-Stack Engineer",
    sameAs: ["https://github.com/rohandev19", "https://linkedin.com/in/rohandev19"],
    knowsAbout: [
      "Software Engineering",
      "Full-Stack Development",
      "React",
      "Next.js",
      "React Native",
      "Node.js",
      "TypeScript",
    ],
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Rohan's Portfolio",
    url: "https://rohandev19.github.io",
    description: "Portfolio of a Junior Full-Stack Engineer.",
  };
}

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";
import { SkipToContent } from "@/components/ui/SkipToContent";
import { DotNav } from "@/components/ui/DotNav";
import { heroData } from "@/content/hero";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rohan | Fullstack Developer",
  description: "Portfolio of Rohan, a Fullstack Developer specializing in modern web technologies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: heroData.name,
    jobTitle: heroData.title,
    url: "https://rohan-portfolio.vercel.app",
    sameAs: ["https://github.com/rohandev19"],
  };

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#070B14] text-[#F8FAFC]`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <ClientProviders>
          <SkipToContent />
          <DotNav />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

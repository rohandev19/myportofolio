import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";
import { SkipToContent } from "@/components/ui/SkipToContent";
import { DotNav } from "@/components/ui/DotNav";
import { TopNav } from "@/components/ui/TopNav";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { AmbientOrbs } from "@/components/ui/AmbientOrbs";
import { SiteControls } from "@/components/ui/SiteControls";

import { constructMetadata } from "@/lib/seo/metadata";
import { generatePersonSchema, generateWebsiteSchema } from "@/lib/seo/schema";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemas = [generatePersonSchema(), generateWebsiteSchema()];

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Anti-flash theme script - runs before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme-storage');
                  var theme = stored ? JSON.parse(stored).state.theme : 'system';
                  var resolved = theme === 'system' 
                    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                    : theme;
                  document.documentElement.setAttribute('data-theme', resolved);
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
        />
        <ClientProviders>
          <AmbientOrbs />
          <ScrollProgress />
          <CustomCursor />
          <SkipToContent />
          <TopNav />
          <DotNav />
          <SiteControls />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

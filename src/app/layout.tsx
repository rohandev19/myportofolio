import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";
import { SkipToContent } from "@/components/ui/SkipToContent";
import { DotNav } from "@/components/ui/DotNav";

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
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#070B14] text-[#F8FAFC]`}
      >
        <ClientProviders>
          <SkipToContent />
          <DotNav />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

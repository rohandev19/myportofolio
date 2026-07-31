import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics Dashboard | Rohan Portfolio",
  description: "Privacy-first analytics dashboard with Web Vitals monitoring and visitor insights.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" className="min-h-screen">
      {children}
    </main>
  );
}

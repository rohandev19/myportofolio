import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-xl text-slate-400 mb-8">
        Project case study not found. It may have been removed or renamed.
      </p>
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)] border border-[var(--color-accent-cyan)]/20 hover:bg-[var(--color-accent-cyan)]/20 transition-colors"
      >
        ← View All Projects
      </Link>
    </div>
  );
}

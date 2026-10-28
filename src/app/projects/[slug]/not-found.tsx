import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <h1 className="text-6xl font-bold text-[var(--color-text-primary)] mb-4">404</h1>
      <p className="text-xl text-[var(--color-text-secondary)] mb-8">
        Project case study not found. It may have been removed or renamed.
      </p>
      <Link
        href="/projects"
        className="px-6 py-2.5 btn-unified font-semibold rounded-lg hover:opacity-90 transition-all"
      >
        ← View All Projects
      </Link>
    </div>
  );
}

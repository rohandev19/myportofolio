import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-xl text-slate-400 mb-8">
        Article not found. It may have been moved or deleted.
      </p>
      <Link
        href="/blog"
        className="px-6 py-2.5 btn-unified font-semibold rounded-lg hover:opacity-90 transition-all"
      >
        ← Back to Blog
      </Link>
    </div>
  );
}

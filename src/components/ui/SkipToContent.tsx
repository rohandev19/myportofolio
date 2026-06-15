/**
 * Skip to Content
 *
 * Accessibility component that allows keyboard users to skip
 * navigation and go directly to main content.
 * Visible only when focused via Tab key.
 */

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="fixed top-4 left-4 z-[9999] -translate-y-[150%] rounded-md bg-[var(--color-accent-blue)] px-4 py-2 text-sm font-bold text-[var(--color-bg-primary)] transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-violet)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)]"
      aria-label="Skip to main content"
    >
      Skip to content
    </a>
  );
}

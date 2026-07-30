/**
 * Skeleton Loader
 *
 * Loading placeholder with shimmer animation.
 * Supports multiple variants: line, card, circle.
 */

interface SkeletonLoaderProps {
  variant?: "line" | "card" | "circle";
  className?: string;
  width?: string;
  height?: string;
  count?: number;
}

export function SkeletonLoader({
  variant = "line",
  className = "",
  width,
  height,
  count = 1,
}: SkeletonLoaderProps) {
  const baseClasses = "relative overflow-hidden bg-gray-800/50";

  const variantClasses = {
    line: "h-4 w-full rounded",
    card: "h-48 w-full rounded-lg",
    circle: "rounded-full",
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${baseClasses} ${variantClasses[variant]} ${className}`}
          style={style}
          aria-busy="true"
          aria-label="Loading content"
        >
          {/* Shimmer effect */}
          <div
            className="absolute inset-0 -translate-x-full animate-shimmer"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
            }}
          />
        </div>
      ))}
    </>
  );
}

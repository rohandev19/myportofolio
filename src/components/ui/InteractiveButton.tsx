"use client";

import { useRef, ReactNode } from "react";
import gsap from "gsap";

interface InteractiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  as?: "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
}

export function InteractiveButton({
  children,
  className = "",
  as = "button",
  href,
  target,
  rel,
  ...props
}: InteractiveButtonProps) {
  const buttonRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Magnetic effect: Move button slightly towards mouse
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const moveX = (x - centerX) * 0.2;
    const moveY = (y - centerY) * 0.2;

    gsap.to(buttonRef.current, {
      x: moveX,
      y: moveY,
      duration: 0.3,
      ease: "power2.out",
    });

    // Spotlight effect
    if (spotlightRef.current) {
      gsap.to(spotlightRef.current, {
        x: x - rect.width / 2,
        y: y - rect.height / 2,
        opacity: 1,
        duration: 0.2,
      });
    }
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current) return;

    // Reset magnetic
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.3)",
    });

    // Reset spotlight
    if (spotlightRef.current) {
      gsap.to(spotlightRef.current, {
        opacity: 0,
        duration: 0.3,
      });
    }
  };

  const baseClasses = `relative overflow-hidden group transition-colors ${className}`;

  const renderContent = () => (
    <>
      {/* Spotlight */}
      <div
        ref={spotlightRef}
        className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 mix-blend-screen"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 50%)",
        }}
      />
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </>
  );

  if (as === "a") {
    return (
      <a
        ref={buttonRef}
        href={href}
        target={target}
        rel={rel}
        className={baseClasses}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {renderContent()}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef}
      className={baseClasses}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {renderContent()}
    </button>
  );
}

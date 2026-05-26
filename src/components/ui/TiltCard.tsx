"use client";

import { useRef, useState, ReactNode } from "react";
import gsap from "gsap";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glareRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    // Calculate mouse position relative to card center (-1 to 1)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Apply tilt (max 15 degrees)
    gsap.to(cardRef.current, {
      rotateY: x * 15,
      rotateX: -y * 15,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1000,
    });

    // Move glare
    gsap.to(glareRef.current, {
      x: x * 100,
      y: y * 100,
      opacity: 0.8,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!cardRef.current || !glareRef.current) return;

    // Reset tilt
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.7,
      ease: "power3.out",
    });

    // Reset glare
    gsap.to(glareRef.current, {
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
    });
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden transition-all duration-300 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Glare effect */}
      <div
        ref={glareRef}
        className="absolute inset-0 z-20 pointer-events-none opacity-0 mix-blend-overlay"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 60%)",
          transform: "translate(-50%, -50%) scale(2)",
          width: "200%",
          height: "200%",
        }}
      />
      {children}
    </div>
  );
}

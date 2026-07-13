"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function RobotCharacter({ className = "" }: { className?: string }) {
  const robotRef = useRef<SVGSVGElement>(null);
  const wavingArmRef = useRef<SVGGElement>(null);

  useGSAP(() => {
    if (!robotRef.current || !wavingArmRef.current) return;

    // The entire robot swings slightly as if hanging
    gsap.to(robotRef.current, {
      rotate: 5,
      transformOrigin: "top right",
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // The arm waves quickly back and forth
    gsap.to(wavingArmRef.current, {
      rotate: -30,
      transformOrigin: "bottom left",
      duration: 0.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  });

  return (
    <svg
      ref={robotRef}
      className={className}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hanging Arm (Right Arm) */}
      <path d="M70 30 Q 90 10, 95 0" stroke="white" strokeWidth="6" strokeLinecap="round" />

      {/* Waving Arm (Left Arm) */}
      <g ref={wavingArmRef}>
        <path d="M30 40 Q 10 20, 5 30" stroke="white" strokeWidth="6" strokeLinecap="round" />
        <circle cx="5" cy="30" r="4" fill="white" />
      </g>

      {/* Body (Baymax-like oval) */}
      <ellipse cx="50" cy="60" rx="30" ry="40" fill="white" />

      {/* Head */}
      <ellipse cx="50" cy="20" rx="15" ry="10" fill="white" />

      {/* Eyes (Baymax style) */}
      <circle cx="45" cy="20" r="2" fill="black" />
      <circle cx="55" cy="20" r="2" fill="black" />
      <line x1="45" y1="20" x2="55" y2="20" stroke="black" strokeWidth="1" />

      {/* Legs stepping down */}
      <path d="M40 95 L 40 115" stroke="white" strokeWidth="8" strokeLinecap="round" />
      <path d="M60 95 L 60 115" stroke="white" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

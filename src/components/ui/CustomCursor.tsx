"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    // We only want custom cursor on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      cursor.style.display = "none";
      follower.style.display = "none";
      return;
    }

    // Set initial GSAP properties
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(follower, { xPercent: -50, yPercent: -50 });

    const moveCursor = (e: MouseEvent) => {
      // Fast movement for the dot
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });

      // Slower, smooth movement for the follower ring
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power3.out",
      });
    };

    const handleMouseEnter = () => {
      gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 });
      gsap.to(follower, {
        scale: 2.5,
        backgroundColor: "rgba(56, 189, 248, 0.15)",
        borderColor: "rgba(56, 189, 248, 0.8)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.2 });
      gsap.to(follower, {
        scale: 1,
        backgroundColor: "rgba(56, 189, 248, 0.1)",
        borderColor: "rgba(56, 189, 248, 0.5)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", moveCursor);

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll(
      "a, button, input, textarea, select, .magnetic"
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  });

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-[#38BDF8] rounded-full pointer-events-none z-[100] mix-blend-screen hidden md:block"
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 border border-[#38BDF8]/50 bg-[#38BDF8]/10 rounded-full pointer-events-none z-[99] transition-opacity mix-blend-screen hidden md:block"
      />
    </>
  );
}

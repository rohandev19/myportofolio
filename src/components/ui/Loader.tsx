"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useAppGlobal } from "@/components/ClientProviders";

export function Loader() {
  const [shouldShow, setShouldShow] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { setIsReady } = useAppGlobal();

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("visited");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hasVisited || prefersReducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShouldShow(false);
      setIsReady(true);
      sessionStorage.setItem("visited", "true");
      return;
    }

    sessionStorage.setItem("visited", "true");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setShouldShow(false);
          setIsReady(true);
        },
      });

      tl.to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      })
        .to(textRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.4,
          ease: "power3.in",
          delay: 0.2, // Total time so far: ~1.1s (well within <=1.5s requirement)
        })
        .to(loaderRef.current, {
          yPercent: -100,
          duration: 0.4,
          ease: "power4.inOut",
        });
    }, loaderRef);

    return () => ctx.revert();
  }, [setIsReady]);

  if (!shouldShow) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#070B14] text-[#F8FAFC]"
    >
      <div
        ref={textRef}
        className="opacity-0 translate-y-4 font-mono text-xl md:text-2xl font-bold tracking-widest text-[#38BDF8]"
      >
        Initializing...
      </div>
    </div>
  );
}

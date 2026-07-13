"use client";

import { useEffect, ReactNode, createContext, useContext, useState } from "react";
import Lenis from "lenis";
import { ErrorBoundary } from "react-error-boundary";
import { GlobalErrorFallback } from "./error-boundaries/GlobalErrorBoundary";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AppGlobalContextType {
  isReady: boolean;
  setIsReady: (val: boolean) => void;
}

const AppGlobalContext = createContext<AppGlobalContextType>({
  isReady: false,
  setIsReady: () => {},
});

export const useAppGlobal = () => useContext(AppGlobalContext);

interface ClientProvidersProps {
  children: ReactNode;
}

import { Preloader } from "./ui/Preloader";

export function ClientProviders({ children }: ClientProvidersProps) {
  const [isReady, setIsReady] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    // Synchronize Lenis with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      // Cleanup on unmount
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <AppGlobalContext.Provider value={{ isReady, setIsReady }}>
      <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
        {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}
        {children}
      </ErrorBoundary>
    </AppGlobalContext.Provider>
  );
}

"use client";

import {
  useEffect,
  useRef,
  ReactNode,
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import Lenis from "lenis";
import { ErrorBoundary } from "react-error-boundary";
import { GlobalErrorFallback } from "./error-boundaries/GlobalErrorBoundary";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Preloader } from "./ui/Preloader";
import { ToastContainer } from "./ui/ToastContainer";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { CommandPalette } from "./features/command-palette";
import { useCommandPalette } from "@/hooks/use-command-palette";
import { usePathname } from "next/navigation";

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

export function ClientProviders({ children }: ClientProvidersProps) {
  const [isReady, setIsReady] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
    setIsReady(true);
  }, []);

  // Initialize global keyboard shortcuts for command palette
  useCommandPalette();

  useEffect(() => {
    // Check if already visited in this session
    if (typeof window !== "undefined" && sessionStorage.getItem("visited") === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowPreloader(false);
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Synchronize Lenis with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);

    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      // Cleanup on unmount
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Handle route changes
  useEffect(() => {
    if (lenisRef.current) {
      // Reset scroll position immediately on route change
      lenisRef.current.scrollTo(0, { immediate: true });

      // Refresh ScrollTrigger after a short delay to allow DOM to update
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [pathname]);

  return (
    <AppGlobalContext.Provider value={{ isReady, setIsReady }}>
      <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
        <ThemeProvider>
          <ToastContainer />
          <CommandPalette />
          {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}
          {children}
        </ThemeProvider>
      </ErrorBoundary>
    </AppGlobalContext.Provider>
  );
}

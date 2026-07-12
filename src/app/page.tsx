"use client";

import { useState } from "react";
import { Loader } from "@/components/ui/Loader";
import { HeroScene } from "@/components/scenes/HeroScene";
import { AboutScene } from "@/components/scenes/AboutScene";
import { JourneyTimelineScene } from "@/components/scenes/JourneyTimelineScene";
import { TechGalaxyScene } from "@/components/scenes/TechGalaxyScene";
import { PhilosophyScene } from "@/components/scenes/PhilosophyScene";

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  return (
    <main id="main-content" className="min-h-screen flex flex-col items-center w-full">
      <Loader onComplete={() => setIsReady(true)} />
      <HeroScene isReady={isReady} />
      {isReady && (
        <>
          <AboutScene />
          <JourneyTimelineScene />
          <TechGalaxyScene />
          <PhilosophyScene />
        </>
      )}
      {/* Scenes will be added here in future phases */}
    </main>
  );
}

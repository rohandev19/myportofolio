"use client";

import { useState } from "react";
import { Loader } from "@/components/ui/Loader";
import { HeroScene } from "@/components/scenes/HeroScene";
import { AboutScene } from "@/components/scenes/AboutScene";
import { JourneyTimelineScene } from "@/components/scenes/JourneyTimelineScene";
import { TechGalaxyScene } from "@/components/scenes/TechGalaxyScene";
import { PhilosophyScene } from "@/components/scenes/PhilosophyScene";
import { ShowcaseScene } from "@/components/scenes/ShowcaseScene";
import { ContactScene } from "@/components/scenes/ContactScene";

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
          <ShowcaseScene />
          <ContactScene />
        </>
      )}
    </main>
  );
}

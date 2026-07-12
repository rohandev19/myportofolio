"use client";

import { useState } from "react";
import { Loader } from "@/components/ui/Loader";
import { HeroScene } from "@/components/scenes/HeroScene";

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  return (
    <main id="main-content" className="min-h-screen flex flex-col items-center w-full">
      <Loader onComplete={() => setIsReady(true)} />
      <HeroScene isReady={isReady} />
      {/* Scenes will be added here in future phases */}
    </main>
  );
}

import { HeroScene } from "@/components/scenes/HeroScene";
import { AboutScene } from "@/components/scenes/AboutScene";
import { ShowcaseScene } from "@/components/scenes/ShowcaseScene";
import { JourneyTimelineScene } from "@/components/scenes/JourneyTimelineScene";
import { TechGalaxyScene } from "@/components/scenes/TechGalaxyScene";
import { PhilosophyScene } from "@/components/scenes/PhilosophyScene";
import { InteractivePlaygroundScene } from "@/components/scenes/InteractivePlaygroundScene";
import { ContactScene } from "@/components/scenes/ContactScene";

export default function Home() {
  return (
    <main
      id="main-content"
      role="main"
      className="relative min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-hidden"
    >
      <HeroScene />
      <AboutScene />
      <ShowcaseScene />
      <JourneyTimelineScene />
      <TechGalaxyScene />
      <PhilosophyScene />
      <InteractivePlaygroundScene />
      <ContactScene />
    </main>
  );
}

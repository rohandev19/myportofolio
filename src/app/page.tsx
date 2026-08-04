import { Loader } from "@/components/ui/Loader";
import { HeroScene } from "@/components/scenes/HeroScene";
import { AboutScene } from "@/components/scenes/AboutScene";
import { JourneyTimelineScene } from "@/components/scenes/JourneyTimelineScene";
import { TechGalaxyScene } from "@/components/scenes/TechGalaxyScene";
import { PhilosophyScene } from "@/components/scenes/PhilosophyScene";
import { ShowcaseScene } from "@/components/scenes/ShowcaseScene";
import { ContactScene } from "@/components/scenes/ContactScene";
import { InteractivePlaygroundScene } from "@/components/scenes/InteractivePlaygroundScene";

export default function Home() {
  return (
    <main
      id="main-content"
      role="main"
      className="relative min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-hidden"
    >
      <Loader />
      <HeroScene />
      <AboutScene />
      <InteractivePlaygroundScene />
      <JourneyTimelineScene />
      <TechGalaxyScene />
      <PhilosophyScene />
      <ShowcaseScene />
      <ContactScene />
    </main>
  );
}

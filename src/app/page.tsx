import { Loader } from "@/components/ui/Loader";
import { HeroScene } from "@/components/scenes/HeroScene";
import { AboutScene } from "@/components/scenes/AboutScene";
import { JourneyTimelineScene } from "@/components/scenes/JourneyTimelineScene";
import { TechGalaxyScene } from "@/components/scenes/TechGalaxyScene";
import { PhilosophyScene } from "@/components/scenes/PhilosophyScene";
import { ShowcaseScene } from "@/components/scenes/ShowcaseScene";
import { ContactScene } from "@/components/scenes/ContactScene";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0F172A] text-slate-50 overflow-hidden">
      <Loader />
      <HeroScene />
      <AboutScene />
      <JourneyTimelineScene />
      <TechGalaxyScene />
      <PhilosophyScene />
      <ShowcaseScene />
      <ContactScene />
    </main>
  );
}

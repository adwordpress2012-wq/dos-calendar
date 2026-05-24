import { FeatureCards } from "@/components/FeatureCards";
import { Hero } from "@/components/Hero";
import { VisualFlow } from "@/components/VisualFlow";

export default function Home() {
  return (
    <main>
      <Hero />
      <VisualFlow />
      <FeatureCards />
    </main>
  );
}

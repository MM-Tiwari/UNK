import { Hero } from "@/components/landing/hero";
import { Pipeline } from "@/components/landing/pipeline";
import { FeatureGrid } from "@/components/landing/feature-grid";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Pipeline />
      <FeatureGrid />
    </div>
  );
}

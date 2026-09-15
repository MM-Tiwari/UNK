import { ResultsDashboard } from "@/components/results/results-dashboard";

export const metadata = {
  title: "System Analysis Dashboard — UNK",
  description: "Detailed breakdown of blind spots, failure modes, dependencies, and assumptions surfaced by UNK.",
};

export default function ResultsPage() {
  return <ResultsDashboard />;
}

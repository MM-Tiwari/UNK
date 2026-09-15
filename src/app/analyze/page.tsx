import { AnalysisInput } from "@/components/analyze/analysis-input";
import { BestPractices } from "@/components/analyze/best-practices";

export const metadata = {
  title: "Analyze a System — UNK",
  description: "Provide system architecture or proposal context to detect blind spots, hidden assumptions, and dependencies.",
};

export default function AnalyzePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          System Ingestion
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
          Analyze a System
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Give UNK enough context to challenge your assumptions.
        </p>
      </div>

      {/* Main Grid: Input Area (2 cols) + Best Practices Panel (1 col) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8">
            <AnalysisInput />
          </div>
        </div>

        <div className="lg:col-span-1">
          <BestPractices />
        </div>
      </div>
    </div>
  );
}

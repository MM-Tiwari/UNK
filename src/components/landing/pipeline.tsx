import {
  FileText,
  Cpu,
  ShieldAlert,
  Flame,
  FileCheck2,
  ArrowRight,
  ArrowDown,
} from "lucide-react";

interface PipelineStep {
  tag: string;
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const pipelineSteps: PipelineStep[] = [
  {
    tag: "01",
    name: "INPUT",
    desc: "Ingest architecture specs, system documents, technical proposals, or free-form context.",
    icon: FileText,
  },
  {
    tag: "02",
    name: "UNDERSTAND",
    desc: "Extract core entities, boundaries, stated constraints, and implicit operational claims.",
    icon: Cpu,
  },
  {
    tag: "03",
    name: "CHALLENGE",
    desc: "Interrogate unstated assumptions, third-party reliance, and untested premise chains.",
    icon: ShieldAlert,
  },
  {
    tag: "04",
    name: "STRESS TEST",
    desc: "Simulate failure modes, cascading dependency cuts, boundary edge cases, and load spikes.",
    icon: Flame,
  },
  {
    tag: "05",
    name: "BLIND-SPOT REPORT",
    desc: "Synthesize structured findings with severity, impact, confidence, and actionable mitigation.",
    icon: FileCheck2,
  },
];

const reasoningStages = [
  "System Description",
  "Context Extraction",
  "Assumption Mapping",
  "Dependency Analysis",
  "Failure Analysis",
  "Risk Scoring",
  "Blind-Spot Report",
];

export function Pipeline() {
  return (
    <section id="how-it-works" className="border-t border-border/40 py-20 px-4 sm:px-6 scroll-mt-16">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <p className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Systematic Methodology
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Analysis Pipeline
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
            From raw input to prioritized risk matrix, every stage applies rigorous adversarial reasoning.
          </p>
        </div>

        {/* 5-Stage Visual Pipeline */}
        <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === pipelineSteps.length - 1;

            return (
              <div
                key={step.name}
                className="group relative flex flex-col justify-between rounded-xl border border-border/60 bg-card/60 p-5 transition-all duration-200 hover:border-border hover:bg-card/90"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-muted-foreground">
                      {step.tag}
                    </span>
                    <div className="rounded-md border border-border/50 bg-background/50 p-1.5 text-muted-foreground group-hover:text-foreground transition-colors">
                      <Icon className="size-4" />
                    </div>
                  </div>

                  <h3 className="mt-4 font-mono text-sm font-bold tracking-wide text-foreground">
                    {step.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>

                {!isLast && (
                  <div className="mt-4 flex items-center justify-end text-muted-foreground/40 lg:hidden">
                    <ArrowDown className="size-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* "How UNK thinks" reasoning flow */}
        <div className="mt-16 rounded-2xl border border-border/50 bg-card/40 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                How UNK thinks
              </h3>
              <p className="text-xs text-muted-foreground">
                Internal deterministic chain-of-thought applied during evaluation
              </p>
            </div>
            <span className="self-start sm:self-auto rounded border border-border/60 bg-muted/30 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
              7-Phase Reasoning
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {reasoningStages.map((stage, idx) => (
              <div key={stage} className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span>{stage}</span>
                </div>
                {idx < reasoningStages.length - 1 && (
                  <ArrowRight className="size-3.5 text-muted-foreground/60 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

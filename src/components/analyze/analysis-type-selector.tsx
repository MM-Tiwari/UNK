"use client";

import { AnalysisType, ANALYSIS_TYPE_LABELS } from "@/types/analysis";
import { cn } from "@/lib/utils";

interface AnalysisTypeSelectorProps {
  value: AnalysisType;
  onChange: (val: AnalysisType) => void;
}

const typeOptions: { id: AnalysisType; label: string; desc: string }[] = [
  {
    id: "general",
    label: ANALYSIS_TYPE_LABELS["general"],
    desc: "Multi-domain systems, operations, or generic workflows",
  },
  {
    id: "software-architecture",
    label: ANALYSIS_TYPE_LABELS["software-architecture"],
    desc: "Distributed services, DBs, cloud infra, APIs, concurrency",
  },
  {
    id: "business-product",
    label: ANALYSIS_TYPE_LABELS["business-product"],
    desc: "GTM plans, unit economics, market adoption, monetization",
  },
  {
    id: "research-proposal",
    label: ANALYSIS_TYPE_LABELS["research-proposal"],
    desc: "Methodologies, dataset validity, hypothesis verifiability",
  },
  {
    id: "project-proposal",
    label: ANALYSIS_TYPE_LABELS["project-proposal"],
    desc: "Milestones, staffing dependencies, scope creep, delivery",
  },
];

export function AnalysisTypeSelector({
  value,
  onChange,
}: AnalysisTypeSelectorProps) {
  return (
    <div>
      <label
        htmlFor="analysis-type"
        className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2"
      >
        Analysis Type
      </label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {typeOptions.map((opt) => {
          const isSelected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={cn(
                "flex flex-col items-start rounded-lg border p-3 text-left transition-all",
                isSelected
                  ? "border-foreground/40 bg-muted/60 ring-1 ring-border shadow-xs"
                  : "border-border/60 bg-card/40 hover:border-border hover:bg-card/80"
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  {opt.label}
                </span>
                {isSelected && (
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                )}
              </div>
              <span className="mt-1 text-[11px] text-muted-foreground leading-snug">
                {opt.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { MetricCard } from "./metric-card";
import { AlertTriangle, HelpCircle, Network, FileSearch, Shield } from "lucide-react";

interface RiskOverviewProps {
  score?: number | null;
  blindSpotsCount?: number | null;
  assumptionsCount?: number | null;
  dependenciesCount?: number | null;
  evidenceCoverage?: number | null;
}

export function RiskOverview({
  score = null,
  blindSpotsCount = null,
  assumptionsCount = null,
  dependenciesCount = null,
  evidenceCoverage = null,
}: RiskOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Header and Risk Score Banner */}
      <div className="flex flex-col gap-6 rounded-2xl border border-border/70 bg-card/60 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/50 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-amber-400" />
              Analysis Complete
            </span>
            <span className="text-xs text-muted-foreground">
              v0.1.0-pre
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            System Analysis
          </h1>
          <p className="mt-1 text-xs text-muted-foreground max-w-xl">
            Comprehensive audit of structural risks, single points of failure, unvalidated assertions, and hidden dependencies.
          </p>
        </div>

        {/* Overall Risk Score Placeholder */}
        <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-background/60 px-5 py-4 shrink-0">
          <div className="rounded-lg border border-border/60 bg-card/80 p-2.5 text-muted-foreground">
            <Shield className="size-6" />
          </div>
          <div>
            <div className="font-mono text-3xl font-extrabold tracking-tight text-foreground">
              {score !== null ? `${score}/100` : "—"}
            </div>
            <div className="text-xs font-medium text-muted-foreground">
              Deterministic risk score
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Blind Spots"
          value={blindSpotsCount !== null ? blindSpotsCount : "—"}
          subtext="Potential unstated risks identified"
          icon={AlertTriangle}
        />
        <MetricCard
          label="Assumptions"
          value={assumptionsCount !== null ? assumptionsCount : "—"}
          subtext="Unverified premise nodes detected"
          icon={HelpCircle}
        />
        <MetricCard
          label="Dependencies"
          value={dependenciesCount !== null ? dependenciesCount : "—"}
          subtext="Coupled systems & upstream APIs"
          icon={Network}
        />
        <MetricCard
          label="Evidence Coverage"
          value={evidenceCoverage !== null ? `${evidenceCoverage}%` : "—"}
          subtext="Empirical claims with citations"
          icon={FileSearch}
        />
      </div>
    </div>
  );
}

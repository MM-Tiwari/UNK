import { BlindSpotFinding, Severity, SEVERITY_LABELS, CATEGORY_LABELS } from "@/types/analysis";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ShieldAlert, CheckCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FindingCardProps {
  finding: BlindSpotFinding;
}

const severityConfig: Record<
  Severity,
  {
    badgeClass: string;
    borderClass: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  critical: {
    badgeClass: "bg-red-500/10 text-red-400 border-red-500/30",
    borderClass: "border-l-4 border-l-red-500",
    icon: ShieldAlert,
  },
  high: {
    badgeClass: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    borderClass: "border-l-4 border-l-orange-500",
    icon: AlertCircle,
  },
  medium: {
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    borderClass: "border-l-4 border-l-amber-500",
    icon: HelpCircle,
  },
  low: {
    badgeClass: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    borderClass: "border-l-4 border-l-sky-500",
    icon: HelpCircle,
  },
  info: {
    badgeClass: "bg-muted/60 text-muted-foreground border-border/80",
    borderClass: "border-l-4 border-l-border",
    icon: CheckCircle,
  },
};

export function FindingCard({ finding }: FindingCardProps) {
  const config = severityConfig[finding.severity] || severityConfig.info;
  const SeverityIcon = config.icon;

  const formatPercentage = (val: number) => `${Math.round(val * 100)}%`;

  return (
    <article
      aria-label={`${SEVERITY_LABELS[finding.severity]} finding: ${finding.title}`}
      className={cn(
        "rounded-xl border border-border/70 bg-card/60 p-6 transition-all hover:border-border hover:bg-card/80",
        config.borderClass
      )}
    >
      {/* Top Meta: Severity, Category, ID */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn("gap-1 font-mono text-[11px] font-semibold uppercase", config.badgeClass)}
          >
            <SeverityIcon className="size-3" />
            <span>{SEVERITY_LABELS[finding.severity]}</span>
          </Badge>

          <span className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
            {CATEGORY_LABELS[finding.category]}
          </span>
        </div>

        <span className="font-mono text-[10px] text-muted-foreground">
          #{finding.id}
        </span>
      </div>

      {/* Finding Title & Description */}
      <div className="mt-4">
        <h3 className="text-base font-semibold text-foreground">
          {finding.title}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {finding.description}
        </p>
      </div>

      {/* Quantitative Vector Grid: Probability, Uncertainty, Confidence */}
      <div className="mt-5 grid grid-cols-3 gap-2 rounded-lg border border-border/60 bg-background/50 p-3">
        <div>
          <div className="text-[10px] font-mono text-muted-foreground uppercase">Probability</div>
          <div className="mt-0.5 text-xs font-mono font-bold text-foreground">
            {formatPercentage(finding.probability)}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-muted-foreground uppercase">Uncertainty</div>
          <div className="mt-0.5 text-xs font-mono font-bold text-foreground">
            {formatPercentage(finding.uncertainty)}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-mono text-muted-foreground uppercase">Confidence</div>
          <div className="mt-0.5 text-xs font-mono font-bold text-foreground">
            {formatPercentage(finding.confidence)}
          </div>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="mt-5 space-y-3.5 border-t border-border/50 pt-4 text-xs">
        {/* Impact */}
        <div>
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Potential Impact
          </span>
          <p className="mt-1 text-muted-foreground leading-relaxed">
            {finding.impact}
          </p>
        </div>

        {/* Why It Matters */}
        <div>
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Why It Matters
          </span>
          <p className="mt-1 text-muted-foreground leading-relaxed">
            {finding.whyItMatters}
          </p>
        </div>

        {/* Evidence */}
        <div>
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Observed Evidence / Claim Source
          </span>
          <p className="mt-1 text-muted-foreground leading-relaxed font-mono text-xs bg-muted/20 p-3 rounded-lg border border-border/50">
            {finding.evidence}
          </p>
        </div>

        {/* Recommendation */}
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/15 p-4">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Mitigation Recommendation
          </span>
          <p className="mt-1 text-muted-foreground leading-relaxed">
            {finding.recommendation}
          </p>
        </div>
      </div>
    </article>
  );
}

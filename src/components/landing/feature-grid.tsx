import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  HelpCircle,
  Network,
  AlertTriangle,
  Compass,
  FileQuestion,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureItem {
  title: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const features: FeatureItem[] = [
  {
    title: "Hidden Assumptions",
    category: "Implicit Premise",
    description:
      "Uncover foundational premises taken for granted — such as network reliability, user competence, zero data drift, or instant consistency.",
    icon: HelpCircle,
  },
  {
    title: "Dependencies",
    category: "Coupling & Third Parties",
    description:
      "Identify hidden external vendors, transient upstream APIs, shared databases, and single points of failure across the entire dependency graph.",
    icon: Network,
  },
  {
    title: "Failure Modes",
    category: "Resilience & Fallbacks",
    description:
      "Model how subsystems degrade under pressure, partial outages, timeout cascades, silent corruptions, and unhandled exception conditions.",
    icon: AlertTriangle,
  },
  {
    title: "Edge Cases",
    category: "Boundary Conditions",
    description:
      "Stress test scale thresholds, concurrent race conditions, timezone transitions, precision limits, and non-standard input vectors.",
    icon: Compass,
  },
  {
    title: "Missing Evidence",
    category: "Empirical Support",
    description:
      "Highlight speculative claims, unbacked performance estimations, and untested architectural hypothesis masquerading as confirmed facts.",
    icon: FileQuestion,
  },
  {
    title: "Unexplored Scenarios",
    category: "Operational Realities",
    description:
      "Surface disaster recovery gaps, regulatory audits, key personnel turnover, hostile actor exploits, and data migration bottlenecks.",
    icon: EyeOff,
  },
];

export function FeatureGrid() {
  return (
    <section className="border-t border-border py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Audit Categories
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            What does UNK look for?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Six systematic dimensions designed to challenge author optimism and reveal architectural blind spots.
          </p>
        </div>

        {/* 6 Feature Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-xl border border-border bg-card/70 p-6 transition-all duration-200 hover:border-primary/30 hover:bg-card"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-lg border border-border bg-background/60 p-2 text-muted-foreground group-hover:text-primary transition-colors">
                    <Icon className="size-5" />
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                    {feature.category}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Final CTA Section */}
        <div className="mt-24 rounded-2xl border border-border bg-card/60 p-8 sm:p-12 text-center">
          <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Challenge your system.
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground leading-relaxed">
            Provide your architecture, proposal, or business logic. Surface blind spots before production does.
          </p>
          <div className="mt-8">
            <Link
              href="/analyze"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 px-6 font-medium gap-2 shadow-sm"
              )}
            >
              Start Analysis
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

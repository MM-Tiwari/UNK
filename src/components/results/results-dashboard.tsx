"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Layers, Info } from "lucide-react";
import { RiskOverview } from "./risk-overview";
import { FindingsSection } from "./findings-section";
import { FindingCard } from "./finding-card";
import { buttonVariants } from "@/components/ui/button";
import { AnalysisResult, BlindSpotCategory, BlindSpotFinding } from "@/types/analysis";
import { cn } from "@/lib/utils";

const sectionMeta: Array<{ id: string; title: string; tag: string; description: string; category?: BlindSpotCategory }> = [
  { id: "hidden-dependencies", title: "Hidden Dependencies", tag: "Coupling & Topology", description: "Transitive libraries, upstream third-party SLAs, implicit infrastructure expectations, or single points of failure.", category: "dependency" },
  { id: "weak-assumptions", title: "Weak Assumptions", tag: "Premise Vulnerabilities", description: "Critical beliefs about users, performance, availability, regulation, data quality, or business behavior that lack validation.", category: "hidden-assumption" },
  { id: "failure-modes", title: "Failure Modes", tag: "Degradation & Cascades", description: "System behavior during outages, timeouts, partial failures, resource exhaustion, restarts, or unexpected state transitions.", category: "failure-mode" },
  { id: "edge-cases", title: "Edge Cases", tag: "Boundary Anomalies", description: "Boundary inputs, unusual sequences, concurrency windows, scale spikes, malformed payloads, and non-standard user behavior.", category: "edge-case" },
  { id: "missing-evidence", title: "Missing Evidence", tag: "Verification Gaps", description: "Unsubstantiated performance figures, assumptions, customer claims, benchmarks, or requirements that need proof.", category: "missing-evidence" },
  { id: "unexplored-scenarios", title: "Unexplored Scenarios", tag: "Scenario Blind Spots", description: "Important situations the proposal does not appear to consider, including recovery, migration, misuse, scale, and operational scenarios.", category: "unexplored-scenario" },
];

export function ResultsDashboard() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("unk_analysis_result");
      if (raw) setResult(JSON.parse(raw) as AnalysisResult);
    } catch {
      setResult(null);
    }
  }, []);

  const findings = result?.findings ?? [];
  const critical = useMemo(() => findings.filter((finding) => finding.severity === "critical" || finding.severity === "high").slice(0, 5), [findings]);

  if (!result) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">No analysis session found</p>
        <h1 className="mt-2 text-2xl font-bold">Run an analysis first.</h1>
        <Link href="/analyze" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>Go to Analyzer</Link>
      </div>
    );
  }

  const byCategory = (category: BlindSpotCategory) => findings.filter((finding) => finding.category === category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <Link href="/analyze" className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="size-3.5" />Modify Analysis Input</Link>
        <div className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground"><Info className="size-3.5" /><span>Analysis complete · {new Date(result.createdAt).toLocaleString()}</span></div>
      </div>

      <RiskOverview score={result.overallRiskScore} blindSpotsCount={result.metrics?.blindSpots} assumptionsCount={result.metrics?.assumptions} dependenciesCount={result.metrics?.dependencies} evidenceCoverage={result.metrics?.evidenceCoverage} />

      <div className="rounded-xl border border-border/50 bg-card/30 p-4 text-xs leading-relaxed text-muted-foreground">
        <span className="font-mono text-[10px] uppercase tracking-wider text-foreground">Analyzed input</span>
        <p className="mt-1 line-clamp-4">{result.systemDescription}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-y border-border/40 py-3 text-xs font-mono">
        <span className="text-muted-foreground mr-1 flex items-center gap-1.5"><Layers className="size-3.5" />Sections:</span>
        <a href="#critical-blind-spots" className="rounded-md border border-border/50 bg-card/40 px-2.5 py-1 text-muted-foreground hover:text-foreground">Critical Blind Spots</a>
        {sectionMeta.map((section) => <a key={section.id} href={`#${section.id}`} className="rounded-md border border-border/50 bg-card/40 px-2.5 py-1 text-muted-foreground hover:text-foreground">{section.title}</a>)}
      </div>

      <section id="critical-blind-spots" className="space-y-4">
        <div className="border-b border-border/50 pb-3"><span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Catastrophic & High-Impact</span><h2 className="mt-1 text-lg font-bold">Critical Blind Spots</h2><p className="text-xs text-muted-foreground">Cross-category findings with the highest severity. This is a priority view, not a separate finding category.</p></div>
        {critical.length ? <div className="grid gap-4">{critical.map((finding) => <FindingCard key={finding.id} finding={finding} />)}</div> : <p className="rounded-xl border border-border/50 bg-card/30 p-6 text-xs text-muted-foreground">No critical or high-severity findings were returned.</p>}
      </section>

      <div className="space-y-12">
        {sectionMeta.map((section) => {
          const items = section.category ? byCategory(section.category) : [];
          return <FindingsSection key={section.id} id={section.id} title={section.title} categoryTag={section.tag} description={section.description} count={items.length}>{items.map((finding: BlindSpotFinding) => <FindingCard key={finding.id} finding={finding} />)}</FindingsSection>;
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border/60 bg-card/40 p-6 text-center sm:text-left">
        <div><h3 className="text-sm font-semibold">Ready to test another system?</h3><p className="text-xs text-muted-foreground mt-0.5">Run a fresh adversarial audit with a different proposal or architecture.</p></div>
        <Link href="/analyze" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "font-mono text-xs")}>New Analysis Session</Link>
      </div>
    </div>
  );
}

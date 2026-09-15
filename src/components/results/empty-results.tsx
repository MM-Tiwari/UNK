import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Clock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyResultsProps {
  title?: string;
  message?: string;
  showBackToAnalyze?: boolean;
}

export function EmptyResults({
  title = "No findings yet.",
  message = "This analysis session has not been evaluated by the AI engine. Provide a system description on the analyze page to prepare for Step 2 execution.",
  showBackToAnalyze = false,
}: EmptyResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-card/20 p-8 text-center sm:p-12">
      <div className="rounded-full border border-border/70 bg-background/60 p-3 text-muted-foreground">
        <Clock className="size-5" />
      </div>

      <h3 className="mt-4 font-mono text-sm font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-1.5 max-w-md text-xs text-muted-foreground leading-relaxed">
        {message}
      </p>

      {showBackToAnalyze && (
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/analyze"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5 text-xs font-mono"
            )}
          >
            <ArrowLeft className="size-3.5" />
            Back to Ingestion
          </Link>
          <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
            <ShieldCheck className="size-3 text-emerald-400" />
            <span>AI Analysis Engine scheduled for Step 2</span>
          </div>
        </div>
      )}
    </div>
  );
}

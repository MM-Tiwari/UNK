import { CheckCircle2, Info, Lightbulb } from "lucide-react";

export function BestPractices() {
  return (
    <div className="rounded-xl border border-border/70 bg-card/50 p-6">
      <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
        <Lightbulb className="size-4 text-amber-400" />
        <span>For best results</span>
      </div>

      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
        UNK performs deepest when you provide concrete architectural facts rather than high-level marketing descriptions.
      </p>

      <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground">
        <li className="flex items-start gap-2">
          <CheckCircle2 className="size-3.5 text-emerald-400 mt-0.5 shrink-0" />
          <span>
            <strong className="text-foreground">System Intent:</strong> Clearly explain what the system is designed to do and for whom.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle2 className="size-3.5 text-emerald-400 mt-0.5 shrink-0" />
          <span>
            <strong className="text-foreground">Dependencies:</strong> Explicitly mention all third-party APIs, databases, message queues, and external vendors.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle2 className="size-3.5 text-emerald-400 mt-0.5 shrink-0" />
          <span>
            <strong className="text-foreground">Constraints:</strong> Include latency requirements, uptime SLAs, budgets, regulatory limits, or hardware boundaries.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle2 className="size-3.5 text-emerald-400 mt-0.5 shrink-0" />
          <span>
            <strong className="text-foreground">Known Claims:</strong> List key assumptions you are making about user behavior, network reliability, or data volume.
          </span>
        </li>
      </ul>

      <div className="mt-5 rounded-lg border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground flex items-start gap-2">
        <Info className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
        <span className="leading-relaxed">
          UNK treats everything unstated as a potential point of failure. The more honest your input, the more valuable the blind spot audit.
        </span>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function MetricCard({
  label,
  value,
  subtext,
  icon: Icon,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card/60 p-4 transition-all hover:border-border hover:bg-card/80",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {Icon && <Icon className="size-4 text-muted-foreground/70" />}
      </div>

      <div className="mt-2 text-2xl font-mono font-bold tracking-tight text-foreground">
        {value}
      </div>

      {subtext && (
        <p className="mt-1 text-[11px] text-muted-foreground">
          {subtext}
        </p>
      )}
    </div>
  );
}

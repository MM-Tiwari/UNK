import { ReactNode } from "react";
import { EmptyResults } from "./empty-results";

interface FindingsSectionProps {
  id?: string;
  title: string;
  categoryTag: string;
  description: string;
  count?: number;
  children?: ReactNode;
}

export function FindingsSection({
  id,
  title,
  categoryTag,
  description,
  count = 0,
  children,
}: FindingsSectionProps) {
  return (
    <section id={id} className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border/50 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {categoryTag}
            </span>
            <span className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
              {count} findings
            </span>
          </div>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {/* Content or Empty State */}
      {count > 0 && children ? (
        <div className="grid grid-cols-1 gap-4">{children}</div>
      ) : (
        <EmptyResults
          title="No findings yet."
          message={`No findings evaluated for ${title.toLowerCase()}. Run analysis in Step 2 to generate structured reports.`}
        />
      )}
    </section>
  );
}

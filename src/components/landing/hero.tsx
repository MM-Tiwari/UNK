import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24 md:pt-32">
      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Brand tag */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1 backdrop-blur-sm">
        <span className="font-mono text-xs font-bold tracking-widest text-foreground">
          UNK
        </span>
        <span className="h-3 w-px bg-border" />
        <span className="text-xs text-muted-foreground font-mono">
          Unknown Unknowns Detector
        </span>
      </div>

      {/* Main headline */}
      <h1 className="mx-auto max-w-4xl text-3xl font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-5xl md:text-6xl">
        Find the risks you didn&apos;t think to ask about.
      </h1>

      {/* Supporting text */}
      <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        UNK analyzes the assumptions, dependencies, failure modes, edge cases,
        and evidence behind your system to surface potential blind spots before
        they become problems.
      </p>

      {/* CTAs */}
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/analyze"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-11 px-6 font-medium gap-2 shadow-sm"
          )}
        >
          Analyze a System
          <ArrowRight className="size-4" />
        </Link>

        <a
          href="#how-it-works"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 px-6 font-medium gap-2 text-muted-foreground hover:text-foreground"
          )}
        >
          View How It Works
          <ChevronDown className="size-4" />
        </a>
      </div>
    </section>
  );
}

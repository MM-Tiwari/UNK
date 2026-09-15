export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-background/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
        <p>
          <span className="font-mono font-semibold text-foreground">UNK</span>{" "}
          — Unknown Unknowns Detector
        </p>
        <p>Built to surface what you didn&apos;t think to question.</p>
      </div>
    </footer>
  );
}

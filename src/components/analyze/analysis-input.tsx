"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnalysisType } from "@/types/analysis";
import { AnalysisTypeSelector } from "./analysis-type-selector";
import { UploadZone } from "./upload-zone";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle, Sparkles, FileText, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export function AnalysisInput() {
  const router = useRouter();
  const [mode, setMode] = useState<"paste" | "upload">("paste");
  const [content, setContent] = useState("");
  const [analysisType, setAnalysisType] = useState<AnalysisType>("general");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stage, setStage] = useState(0);

  const stages = [
    "Understanding System",
    "Mapping Assumptions",
    "Tracing Dependencies",
    "Challenging Failure Modes",
    "Searching Edge Cases",
    "Auditing Evidence",
    "Calculating Risk",
  ];

  const characterCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  useEffect(() => {
    if (!isAnalyzing) return;
    const timer = window.setInterval(() => setStage((current) => Math.min(current + 1, stages.length - 1)), 2500);
    return () => window.clearInterval(timer);
  }, [isAnalyzing, stages.length]);

  const handleFileSelect = (fileName: string, fileContent?: string) => {
    setSelectedFile(fileName);
    setError(null);
    setContent(fileContent ?? "");
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setContent("");
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedContent = content.trim();

    if (normalizedContent.length < 50) {
      setError("Please provide at least 50 characters of system or project context.");
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setStage(0);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: normalizedContent, analysisType }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error || "Analysis failed. Please try again.");
      }

      sessionStorage.setItem("unk_analysis_result", JSON.stringify(payload));
      router.push("/results");
    } catch (requestError) {
      setIsAnalyzing(false);
      setError(requestError instanceof Error ? requestError.message : "Analysis failed. Please try again.");
    }
  };

  if (isAnalyzing) {
    return (
      <div className="space-y-8 py-4" aria-live="polite">
        <div className="flex items-center gap-3">
          <div className="size-2.5 animate-pulse rounded-full bg-emerald-400" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
              UNK is challenging the system
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              One structured analysis pass across seven reasoning stages.
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {stages.map((label, index) => (
            <div
              key={label}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3.5 py-2.5 text-xs transition-all",
                index <= stage
                  ? "border-border/80 bg-card/80 text-foreground"
                  : "border-border/30 text-muted-foreground/40"
              )}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full border font-mono text-[10px]",
                  index < stage
                    ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                    : index === stage
                    ? "border-foreground/40 text-foreground bg-muted/40"
                    : "border-border/40"
                )}
              >
                {index < stage ? "✓" : index + 1}
              </span>
              <span>{label}</span>
              {index === stage && (
                <span className="ml-auto animate-pulse text-[11px] font-medium text-emerald-400">
                  running
                </span>
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          This can take a little while for a detailed system audit.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleAnalyze} className="space-y-8">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-1 rounded-lg border border-border/70 bg-muted/30 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("paste");
              setError(null);
            }}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              mode === "paste"
                ? "bg-card text-foreground shadow-xs border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <FileText className="size-3.5" />
            <span>Paste Text</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("upload");
              setError(null);
            }}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              mode === "upload"
                ? "bg-card text-foreground shadow-xs border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <UploadCloud className="size-3.5" />
            <span>Upload Text</span>
          </button>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {mode === "paste"
            ? `${characterCount} chars · ${wordCount} words`
            : "Text document mode"}
        </span>
      </div>

      {mode === "paste" ? (
        <div className="space-y-2">
          <label htmlFor="system-description" className="sr-only">
            System Description
          </label>
          <textarea
            id="system-description"
            rows={12}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Describe your system, project, product, research proposal, architecture, or business idea... Include known constraints, key dependencies, user flows, and core assumptions."
            className="w-full resize-y rounded-xl border border-border/70 bg-background/50 p-4 font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Minimum 50 characters required for an audit</span>
            <span className="font-mono">{characterCount} characters</span>
          </div>
        </div>
      ) : (
        <UploadZone
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onClear={handleClearFile}
        />
      )}

      <AnalysisTypeSelector
        value={analysisType}
        onChange={(val) => setAnalysisType(val)}
      />

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-xs text-destructive"
        >
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border/70 bg-card/50 p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="size-4 text-emerald-400 shrink-0" />
          <span>AI analysis runs server-side; your API key never reaches the browser.</span>
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto font-medium gap-2 px-6 h-10"
        >
          Analyze with UNK
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}

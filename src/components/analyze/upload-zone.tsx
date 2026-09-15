"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, Check, X, AlertCircle } from "lucide-react";

interface UploadZoneProps {
  onFileSelect: (fileName: string, content?: string) => void;
  selectedFile: string | null;
  onClear: () => void;
}

export function UploadZone({ onFileSelect, selectedFile, onClear }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    const supported = file.name.endsWith(".md") || file.name.endsWith(".txt") || file.name.endsWith(".json") || file.type.startsWith("text/");
    if (!supported) return;
    const reader = new FileReader();
    reader.onload = (event) => onFileSelect(file.name, String(event.target?.result ?? ""));
    reader.readAsText(file);
  };

  return (
    <div className="space-y-3">
      <input ref={fileInputRef} type="file" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} accept=".txt,.md,.json,text/plain,text/markdown,application/json" className="hidden" aria-label="Upload text document" />
      {!selectedFile ? (
        <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); }} onClick={() => fileInputRef.current?.click()} className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all ${isDragging ? "border-foreground/60 bg-muted/30" : "border-border/70 bg-card/30 hover:border-border hover:bg-card/60"}`} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }} aria-label="Upload text document drop zone">
          <div className="rounded-full border border-border/70 bg-background/60 p-3 text-muted-foreground"><UploadCloud className="size-6" /></div>
          <p className="mt-3 text-xs font-semibold text-foreground">Click to upload or drag and drop</p>
          <p className="mt-1 text-[11px] text-muted-foreground">TXT, Markdown, or JSON · max 100,000 characters</p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded border border-border/50 bg-muted/40 px-2.5 py-1 text-[10px] text-muted-foreground font-mono"><AlertCircle className="size-3" /><span>PDF/DOCX parsing is planned for Step 3.</span></div>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card/60 p-4">
          <div className="flex items-center gap-3"><div className="rounded-lg border border-border/70 bg-background/60 p-2 text-foreground"><FileText className="size-5" /></div><div><p className="text-xs font-semibold text-foreground">{selectedFile}</p><div className="flex items-center gap-1 text-[10px] text-emerald-400"><Check className="size-3" /><span>Content extracted and ready</span></div></div></div>
          <button type="button" onClick={(e) => { e.stopPropagation(); onClear(); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="rounded-md border border-border/60 p-1.5 text-muted-foreground transition-colors hover:border-border hover:text-foreground" aria-label="Remove uploaded file"><X className="size-4" /></button>
        </div>
      )}
    </div>
  );
}

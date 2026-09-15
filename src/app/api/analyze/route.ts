import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeSystem, toPublicFinding } from "@/lib/ai/analyzers";
import { calculateMetrics, calculateOverallRisk, sortFindings } from "@/lib/scoring";
import { AnalysisType } from "@/types/analysis";
import { AIClientError } from "@/lib/ai/client";

export const runtime = "nodejs";

const requestSchema = z.object({
  content: z.string().trim().min(50, "Please provide at least 50 characters of context to analyze.").max(100_000),
  analysisType: z.enum(["general", "software-architecture", "business-product", "research-proposal", "project-proposal"]),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid analysis input." }, { status: 400 });
    }

    const { content, analysisType } = parsed.data;
    const configuredTokenLimit = Number(process.env.MAX_INPUT_TOKENS ?? "16000");
    const estimatedMaxCharacters = Number.isFinite(configuredTokenLimit) && configuredTokenLimit > 0
      ? Math.floor(configuredTokenLimit * 4)
      : 64_000;
    if (content.length > estimatedMaxCharacters) {
      return NextResponse.json({ error: `Input is too large for the configured analysis budget. Please keep it below roughly ${estimatedMaxCharacters.toLocaleString()} characters.` }, { status: 413 });
    }

    const internalFindings = await analyzeSystem(content, analysisType as AnalysisType);
    const publicFindings = internalFindings.map(toPublicFinding);
    const findings = sortFindings(publicFindings, internalFindings);

    return NextResponse.json({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      analysisType,
      systemDescription: content,
      overallRiskScore: calculateOverallRisk(internalFindings),
      metrics: calculateMetrics(internalFindings),
      findings,
      status: "complete",
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }
    if (error instanceof AIClientError) {
      const statusByCode: Record<AIClientError["code"], number> = {
        "missing-key": 503, "bad-request": 400, "rate-limit": 429,
        "api-error": 502, "network-error": 502, "malformed-output": 502,
      };
      return NextResponse.json({ error: error.message, code: error.code }, { status: statusByCode[error.code] });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "The AI returned data that did not match UNK's analysis schema.", code: "malformed-output" }, { status: 502 });
    }
    console.error("UNK analysis error", error);
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Unexpected analysis failure. Please try again.";
    return NextResponse.json({ error: message, code: "internal-error" }, { status: 500 });
  }
}

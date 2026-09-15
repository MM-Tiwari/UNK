import { z } from "zod";
import {
  AnalysisType,
  BlindSpotCategory,
  BlindSpotFinding,
  Severity,
} from "@/types/analysis";
import {
  buildAnalysisPrompt,
  ANALYSIS_SYSTEM_PROMPT,
} from "@/lib/ai/prompts";
import { createStructuredAnalysis, AIClientError } from "@/lib/ai/client";

const categorySchema = z.enum([
  "hidden-assumption",
  "dependency",
  "failure-mode",
  "edge-case",
  "missing-evidence",
  "unexplored-scenario",
]);

const severitySchema = z.enum([
  "critical",
  "high",
  "medium",
  "low",
  "info",
]);

const findingSchema = z.object({
  category: categorySchema,
  severity: severitySchema,

  title: z.string().trim().min(1).max(300),

  description: z.string().trim().min(1).max(1500),

  impact: z.string().trim().min(1).max(1500),

  impactScore: z.coerce.number().transform((val) => Math.max(0, Math.min(1, val))),

  probability: z.coerce.number().transform((val) => Math.max(0, Math.min(1, val))),

  uncertainty: z.coerce.number().transform((val) => Math.max(0, Math.min(1, val))),

  confidence: z.coerce.number().transform((val) => Math.max(0, Math.min(1, val))),

  evidence: z.string().trim().max(1000).default(""),

  hasEvidence: z.boolean().default(false),

  whyItMatters: z.string().trim().min(1).max(1000),

  recommendation: z.string().trim().min(1).max(1500),
});

const analysisSchema = z.object({
  findings: z.array(findingSchema).min(1).max(16),
});

export type InternalFinding = z.infer<typeof findingSchema>;

/**
 * JSON schema sent to the NVIDIA NIM model.
 *
 * IMPORTANT:
 * Keep this schema aligned with findingSchema above.
 */
export const analysisJsonSchema = {
  type: "object",
  additionalProperties: false,

  properties: {
    findings: {
      type: "array",
      minItems: 1,
      maxItems: 12,

      items: {
        type: "object",
        additionalProperties: false,

        properties: {
          category: {
            type: "string",
            enum: categorySchema.options,
          },

          severity: {
            type: "string",
            enum: severitySchema.options,
          },

          title: {
            type: "string",
          },

          description: {
            type: "string",
          },

          impact: {
            type: "string",
          },

          impactScore: {
            type: "number",
            minimum: 0,
            maximum: 1,
          },

          probability: {
            type: "number",
            minimum: 0,
            maximum: 1,
          },

          uncertainty: {
            type: "number",
            minimum: 0,
            maximum: 1,
          },

          confidence: {
            type: "number",
            minimum: 0,
            maximum: 1,
          },

          evidence: {
            type: "string",
          },

          hasEvidence: {
            type: "boolean",
          },

          whyItMatters: {
            type: "string",
          },

          recommendation: {
            type: "string",
          },
        },

        required: [
          "category",
          "severity",
          "title",
          "description",
          "impact",
          "impactScore",
          "probability",
          "uncertainty",
          "confidence",
          "evidence",
          "hasEvidence",
          "whyItMatters",
          "recommendation",
        ],
      },
    },
  },

  required: ["findings"],
} as const;

/**
 * Run the AI analysis and validate the returned structure.
 */
export async function analyzeSystem(
  content: string,
  analysisType: AnalysisType
): Promise<InternalFinding[]> {
  const response = await createStructuredAnalysis<unknown>({
    systemPrompt: ANALYSIS_SYSTEM_PROMPT,
    userPrompt: buildAnalysisPrompt(content, analysisType),
    jsonSchema: analysisJsonSchema,
  });

  const result = analysisSchema.safeParse(response);

  if (!result.success) {
    console.error("========================================");
    console.error("UNK AI SCHEMA VALIDATION FAILED");
    console.error("========================================");

    console.error(
      "Validation issues:"
    );

    console.error(
      JSON.stringify(result.error.issues, null, 2)
    );

    console.error(
      "Raw AI response:"
    );

    console.error(
      JSON.stringify(response, null, 2)
    );

    console.error("========================================");

    const issues = result.error.issues
      .map((issue) => {
        const path =
          issue.path.length > 0
            ? issue.path.join(".")
            : "root";

        return `${path}: ${issue.message}`;
      })
      .join("; ");

    throw new AIClientError(
      `AI returned invalid analysis data: ${issues}`,
      "malformed-output"
    );
  }

  return result.data.findings;
}

/**
 * Convert the internal AI representation into the public
 * BlindSpotFinding type used by the UI and scoring engine.
 */
export function toPublicFinding(
  finding: InternalFinding,
  index: number
): BlindSpotFinding {
  const cleanEvidence = finding.evidence?.trim();
  const displayEvidence =
    cleanEvidence && cleanEvidence.length > 0
      ? cleanEvidence
      : finding.hasEvidence
      ? "Evidence inferred from system context."
      : "No explicit evidence was provided in the input source.";

  return {
    id: `UNK-${String(index + 1).padStart(3, "0")}`,

    category: finding.category as BlindSpotCategory,

    severity: finding.severity as Severity,

    title: finding.title.trim(),

    description: finding.description.trim(),

    impact: finding.impact.trim(),

    probability: finding.probability,

    uncertainty: finding.uncertainty,

    confidence: finding.confidence,

    evidence: displayEvidence,

    whyItMatters: finding.whyItMatters.trim(),

    recommendation: finding.recommendation.trim(),
  };
}
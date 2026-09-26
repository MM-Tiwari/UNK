import assert from "node:assert/strict";
import { test } from "node:test";
import { analysisSchema } from "../src/lib/ai/analyzers";
import { AIClientError, createStructuredAnalysis } from "../src/lib/ai/client";
import {
  calculateFindingRisk,
  calculateMetrics,
  calculateOverallRisk,
} from "../src/lib/scoring";

const validFinding = {
  category: "failure-mode" as const,
  severity: "high" as const,
  title: "Downstream timeout is not bounded",
  description: "The proposal does not define a timeout for the downstream call.",
  impact: "Requests can consume all worker capacity while waiting indefinitely.",
  impactScore: 0.9,
  probability: 0.5,
  uncertainty: 0.4,
  confidence: 0.8,
  evidence: "No timeout policy is described.",
  hasEvidence: true,
  whyItMatters: "Unbounded waits can turn a partial outage into a full service outage.",
  recommendation: "Set a bounded timeout and define retry and fallback behavior.",
};

test("risk scoring is deterministic", () => {
  assert.ok(Math.abs(calculateFindingRisk(validFinding) - 0.18) < Number.EPSILON);
  assert.equal(calculateOverallRisk([validFinding]), 18);
});

test("metrics count categories and evidence coverage", () => {
  const secondFinding = { ...validFinding, category: "dependency" as const, hasEvidence: false };
  assert.deepEqual(calculateMetrics([validFinding, secondFinding]), {
    blindSpots: 2,
    assumptions: 0,
    dependencies: 1,
    evidenceCoverage: 50,
  });
});

test("analysis schema accepts valid findings and clamps score vectors", () => {
  const result = analysisSchema.safeParse({
    findings: [{ ...validFinding, impactScore: 2, probability: -1 }],
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.findings[0].impactScore, 1);
    assert.equal(result.data.findings[0].probability, 0);
  }
});

test("analysis schema rejects unsupported categories", () => {
  const result = analysisSchema.safeParse({
    findings: [{ ...validFinding, category: "unsupported" }],
  });

  assert.equal(result.success, false);
});

test("AI client reports a missing API key without making a request", async () => {
  const previousKey = process.env.NVIDIA_API_KEY;
  delete process.env.NVIDIA_API_KEY;

  try {
    await assert.rejects(
      () =>
        createStructuredAnalysis({
          systemPrompt: "test",
          userPrompt: "test",
          jsonSchema: {},
        }),
      (error: unknown) =>
        error instanceof AIClientError && error.code === "missing-key",
    );
  } finally {
    if (previousKey === undefined) delete process.env.NVIDIA_API_KEY;
    else process.env.NVIDIA_API_KEY = previousKey;
  }
});

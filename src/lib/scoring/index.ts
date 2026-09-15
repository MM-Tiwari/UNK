import { BlindSpotFinding } from "@/types/analysis";
import { InternalFinding } from "@/lib/ai/analyzers";

export function calculateFindingRisk(finding: InternalFinding): number {
  return finding.impactScore * finding.probability * finding.uncertainty;
}

export function calculateOverallRisk(findings: InternalFinding[]): number {
  if (findings.length === 0) return 0;
  const mean = findings.reduce((sum, finding) => sum + calculateFindingRisk(finding), 0) / findings.length;
  return Math.round(mean * 100);
}

export function calculateMetrics(findings: InternalFinding[]): {
  blindSpots: number;
  assumptions: number;
  dependencies: number;
  evidenceCoverage: number;
} {
  const evidenceCount = findings.filter((finding) => finding.hasEvidence).length;
  return {
    blindSpots: findings.length,
    assumptions: findings.filter((finding) => finding.category === "hidden-assumption").length,
    dependencies: findings.filter((finding) => finding.category === "dependency").length,
    evidenceCoverage: findings.length === 0 ? 100 : Math.round((evidenceCount / findings.length) * 100),
  };
}

export function sortFindings(findings: BlindSpotFinding[], internalFindings: InternalFinding[]): BlindSpotFinding[] {
  return findings
    .map((finding, index) => ({ finding, risk: calculateFindingRisk(internalFindings[index]) }))
    .sort((a, b) => b.risk - a.risk)
    .map(({ finding }) => finding);
}

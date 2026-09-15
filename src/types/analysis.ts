/**
 * UNK — Unknown Unknowns Detector
 * Core data model types for analysis engine
 */

export type AnalysisType =
  | "general"
  | "software-architecture"
  | "business-product"
  | "research-proposal"
  | "project-proposal";

export type Severity = "critical" | "high" | "medium" | "low" | "info";

export type BlindSpotCategory =
  | "hidden-assumption"
  | "dependency"
  | "failure-mode"
  | "edge-case"
  | "missing-evidence"
  | "unexplored-scenario";

export interface BlindSpotFinding {
  id: string;
  category: BlindSpotCategory;
  severity: Severity;
  title: string;
  description: string;
  impact: string;
  probability: number; // 0–1
  uncertainty: number; // 0–1
  confidence: number; // 0–1
  evidence: string;
  whyItMatters: string;
  recommendation: string;
}

export interface AnalysisMetrics {
  blindSpots: number;
  assumptions: number;
  dependencies: number;
  evidenceCoverage: number; // 0–100 percentage
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  analysisType: AnalysisType;
  systemDescription: string;
  overallRiskScore: number | null; // null when not yet computed
  metrics: AnalysisMetrics | null;
  findings: BlindSpotFinding[];
  status: "pending" | "analyzing" | "complete" | "error";
}

export interface AnalysisInput {
  content: string;
  analysisType: AnalysisType;
}

/** Labels for analysis type selector */
export const ANALYSIS_TYPE_LABELS: Record<AnalysisType, string> = {
  general: "General System",
  "software-architecture": "Software Architecture",
  "business-product": "Business / Product",
  "research-proposal": "Research Proposal",
  "project-proposal": "Project Proposal",
};

/** Labels for severity levels */
export const SEVERITY_LABELS: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
  info: "Info",
};

/** Labels for blind spot categories */
export const CATEGORY_LABELS: Record<BlindSpotCategory, string> = {
  "hidden-assumption": "Hidden Assumption",
  dependency: "Dependency",
  "failure-mode": "Failure Mode",
  "edge-case": "Edge Case",
  "missing-evidence": "Missing Evidence",
  "unexplored-scenario": "Unexplored Scenario",
};

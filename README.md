# UNK — Unknown Unknowns Detector

> Systematically identify blind spots, hidden assumptions, cascading dependencies, failure modes, edge cases, and unbacked claims before they materialize in production.

---

## Overview

**UNK** is an AI-assisted systems audit and architectural intelligence platform. When technical architects, research teams, or product engineers design systems, cognitive bias and tunnel vision often cause critical premises to remain unstated. 

UNK does not claim to magically foresee arbitrary future anomalies. Instead, it applies a structured adversarial interrogation framework to technical specs, architectural documents, and proposals to systematically surface:

- **Hidden Assumptions:** Foundational premises taken for granted (e.g., zero latency, instant consistency, high network availability).
- **Hidden Dependencies:** External SaaS APIs, transitive library vulnerabilities, shared infrastructure, and single points of failure.
- **Potential Failure Modes:** Cascading timeouts, resource pool exhaustion, split-brain states, and silent data corruption.
- **Edge Cases:** Boundary thresholds, race condition windows, clock drift, and concurrency collisions.
- **Missing Evidence:** Unsupported performance estimations and unbacked empirical claims.
- **Unexplored Scenarios:** Disaster recovery gaps, compliance audits, and scale degradation.

---

## Problem

Human authors design systems under cognitive constraints:
1. **Optimism Bias:** Engineers naturally focus on the "happy path" where network calls succeed and downstream services respond within SLA.
2. **Tacit Knowledge Gaps:** Core operational dependencies often reside only in tribal knowledge and are omitted from architecture documents.
3. **Implicit Invariants:** Assumptions regarding idempotency, clock synchronization, or user compliance are rarely explicitly validated until an outage occurs.

---

## Proposed Solution

UNK ingests system architecture proposals and applies an adversarial audit pipeline that challenges unstated assumptions, maps external coupling, stress-tests failure modes, and outputs a prioritized **Blind Spot Report** equipped with probability, uncertainty, impact, confidence, and mitigation recommendations.

---

## Current Features

- **AI Blind-Spot Analysis:** Server-side OpenAI Responses API integration with strict structured JSON output.
- **Adversarial Analysis Pipeline:** One analysis pass that internally covers system understanding, assumptions, dependencies, failure modes, edge cases, evidence gaps, and unexplored scenarios.
- **Deterministic Risk Scoring:** `Impact × Probability × Uncertainty`, with the internal impact score kept separate from the public finding model.
- **Results Dashboard:** Live risk score, metrics, critical/high-priority findings, and six category sections including Unexplored Scenarios.
- **Validation & Error Handling:** Request validation with Zod plus explicit handling for missing API keys, rate limits, upstream API failures, malformed AI output, timeouts, and network failures.
- **Text/Markdown/JSON Uploads:** Browser-side text extraction for supported formats. PDF/DOCX parsing is intentionally deferred to Step 3.
- **Session-Based Results:** The completed analysis is stored in browser `sessionStorage` so the results page can render the current run without a database.
- **Security:** The OpenAI key is used only on the server and is never sent to the browser.

## Planned Features (Upcoming Steps)

- **Step 3 — Document Parsing & Ingestion:**
  - Multi-format document parser (PDF, Markdown, DOCX, OpenAPI/Swagger JSON).
  - Chunking and AST extraction for software architecture diagrams and schemas.
- **Step 4 — Export & Collaboration:**
  - Export structured Blind Spot Reports to Markdown, JSON, and PDF formats.
  - Issue tracker export (GitHub Issues, Linear tickets, Jira).

---

## Architecture

```
UNK Architecture
├── Client Application (Next.js 16 App Router)
│   ├── Landing Page (/)
│   ├── Ingestion Interface (/analyze)
│   └── Results Dashboard (/results)
├── Domain Types & Contracts (`src/types/`)
│   └── analysis.ts (BlindSpotFinding, AnalysisResult, Metrics)
├── Future AI Pipeline Modules (`src/lib/`)
│   ├── ai/
│   │   ├── client.ts (LLM Gateway)
│   │   ├── prompts/ (Adversarial System Prompts)
│   │   └── analyzers/ (Domain-Specific Reasoning)
│   ├── scoring/ (Risk & Confidence Scoring)
│   └── parsing/ (Multi-format Document Ingestion)
└── UI Design System (`src/components/`)
    ├── ui/ (shadcn base-ui primitives)
    ├── layout/ (Navbar, Footer)
    ├── landing/ (Hero, Pipeline, FeatureGrid)
    ├── analyze/ (Input Orchestrator, TypeSelector, UploadZone, BestPractices)
    └── results/ (RiskOverview, FindingCard, FindingsSection, EmptyResults)
```

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (v16 App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4)
- **Component Primitives:** [shadcn/ui](https://ui.shadcn.com/) (`@base-ui/react`)
- **Icons:** [Lucide Icons](https://lucide.dev/)
- **Linting & Code Quality:** ESLint with Next.js configuration

---

## Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout (Dark theme, Navbar, Footer)
│   │   ├── page.tsx        # Landing page
│   │   ├── globals.css     # Design tokens & Tailwind theme
│   │   ├── analyze/
│   │   │   └── page.tsx    # System ingestion page
│   │   └── results/
│   │       └── page.tsx    # Results dashboard page
│   ├── components/
│   │   ├── analyze/        # Input orchestrators & guidance
│   │   ├── landing/        # Hero, Pipeline, FeatureGrid
│   │   ├── layout/         # Responsive Navbar & Footer
│   │   ├── results/        # RiskOverview, FindingCard, Sections
│   │   └── ui/             # Core UI components
│   ├── lib/
│   │   ├── ai/             # Future AI engine stubs
│   │   ├── parsing/        # Future parser stubs
│   │   ├── scoring/        # Future scoring engine stubs
│   │   └── utils.ts        # Tailwind merge & styling utilities
│   └── types/
│       └── analysis.ts     # Core domain type definitions
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── components.json         # shadcn configuration
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

---

## Local Development

### Prerequisites

- Node.js 18.18+ or 20+
- npm 9+

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/unk.git
   cd unk
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` — Starts the Next.js local development server.
- `npm run build` — Builds the application for production.
- `npm run start` — Runs the compiled production build.
- `npm run lint` — Runs ESLint code quality checks.

---

## Roadmap

- [x] **Milestone 1:** Architecture foundation, domain modeling, and responsive dark-first frontend UI.
- [x] **Milestone 2:** OpenAI LLM integration, adversarial challenge prompts, structured validation, and deterministic risk scoring.
- [ ] **Milestone 3:** Document ingestion engine (PDF text extraction, Markdown AST parsing).
- [ ] **Milestone 4:** Exporting and report sharing (PDF reports, JSON export, GitHub issues integration).

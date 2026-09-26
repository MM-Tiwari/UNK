# UNK — Unknown Unknowns Detector

> An AI-powered tool that helps you find risks and blind spots in a system, product, or project idea.

## Live Links

Add your deployed links here after hosting the project:

- **Live Demo:** `[Add deployed demo link here]`
- **Repository:** [https://github.com/MM-Tiwari/UNK](https://github.com/MM-Tiwari/UNK)
- **API URL:** `[Add deployed API link here if needed]`

---

## What is UNK?

When people design a system or project, they usually focus on what should happen when everything works correctly. They may forget to think about:

- What happens when an API is unavailable?
- What assumptions are being made about users or data?
- Which outside services does the project depend on?
- What happens when the system receives unexpected input?
- What evidence supports the expected performance?
- What happens during a failure, migration, or sudden increase in traffic?

UNK is designed to ask these questions.

You provide a description of a system, product, architecture, research idea, or project proposal. UNK sends it to an AI analysis engine and produces a structured **Blind Spot Report**.

The report groups possible issues into categories, gives each issue a severity, calculates a risk score, and suggests possible mitigations.

> UNK does not predict the future. It uses the information you provide to identify risks, assumptions, and questions that may deserve more attention.

## Why was this project built?

People often miss important risks because of:

1. **Optimism bias** — expecting the happy path where everything works.
2. **Hidden knowledge** — depending on information that was never written down.
3. **Unstated assumptions** — assuming that a service is always available, data is always correct, or users always behave as expected.
4. **Incomplete evidence** — making performance or business claims without enough supporting data.

UNK turns these concerns into a repeatable analysis process.

## How it works

1. Open the **Analyze** page.
2. Paste a description or upload a supported text file.
3. Choose the type of analysis.
4. Click **Analyze with UNK**.
5. The server sends the input to NVIDIA NIM.
6. The AI returns structured findings.
7. UNK validates the response and calculates risk metrics.
8. The results dashboard displays the Blind Spot Report.

The analysis uses these seven stages internally:

1. Understand the system
2. Map assumptions
3. Trace dependencies
4. Challenge failure modes
5. Search for edge cases
6. Audit missing evidence
7. Calculate and organize risk

## Main features

- Analyze system descriptions, software architectures, product ideas, research proposals, and project proposals.
- Paste text directly into the analyzer.
- Upload `.txt`, `.md`, and `.json` files.
- Identify hidden assumptions.
- Identify external and internal dependencies.
- Find possible failure modes.
- Find edge cases and unusual scenarios.
- Highlight missing evidence.
- Surface unexplored recovery, migration, misuse, and scale scenarios.
- Assign severity levels: Critical, High, Medium, Low, and Info.
- Calculate a deterministic risk score.
- Show metrics for blind spots, assumptions, dependencies, and evidence coverage.
- Provide recommendations for reducing each risk.
- Validate AI output with Zod before displaying it.
- Handle missing API keys, rate limits, invalid responses, timeouts, and network errors.
- Keep the NVIDIA API key on the server so it is not sent to the browser.
- Store the current analysis result in browser `sessionStorage`.

## Supported input

You can provide input in either of these ways:

### Paste text

Paste a system or project description directly into the text area.

The input must contain at least **50 characters** and can be up to approximately **100,000 characters**, depending on the configured token limit.

For better results, include:

- The purpose of the system
- Main components
- User flows
- Data flows
- External services
- Known constraints
- Performance expectations
- Security or compliance requirements
- Assumptions already made by the team

### Upload a file

The browser currently extracts text from:

- `.txt`
- `.md`
- `.json`
- Other browser-recognized text files

PDF and DOCX parsing are not implemented yet. They are planned for a future version.

## Analysis categories

UNK organizes findings into six categories:

| Category | What it means |
| --- | --- |
| Hidden Assumption | An important belief that has not been verified. |
| Dependency | A service, library, platform, or component that the system relies on. |
| Failure Mode | Something that may go wrong during an outage, timeout, restart, or partial failure. |
| Edge Case | An unusual input, boundary condition, race condition, or unexpected user action. |
| Missing Evidence | A claim or estimate that does not have enough supporting proof. |
| Unexplored Scenario | An important situation that the proposal does not appear to consider. |

## Risk scoring

Each finding has three important numeric values:

- **Impact** — How serious the consequences could be.
- **Probability** — How plausible the issue is based on the supplied input.
- **Uncertainty** — How incomplete or unclear the supporting information is.

The internal risk calculation is:

```text
Impact × Probability × Uncertainty
```

UNK uses this calculation to sort findings and produce an overall risk score from 0 to 100.

## Tech stack

- **Framework:** [Next.js](https://nextjs.org/) 16 with the App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI:** [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4
- **UI primitives:** [Base UI](https://base-ui.com/) and shadcn-style components
- **Icons:** [Lucide](https://lucide.dev/)
- **AI provider:** [NVIDIA NIM](https://build.nvidia.com/)
- **Validation:** [Zod](https://zod.dev/)
- **Testing:** Node test runner through [tsx](https://tsx.is/)
- **Code quality:** ESLint

## Project structure

```text
UNK/
├── public/                 # Static files and icons
├── src/
│   ├── app/
│   │   ├── api/analyze/    # Server endpoint for AI analysis
│   │   ├── analyze/        # Analysis input page
│   │   ├── results/        # Results dashboard page
│   │   ├── globals.css     # Global styles and design tokens
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Landing page
│   ├── components/
│   │   ├── analyze/        # Input, upload, and analysis controls
│   │   ├── landing/        # Landing page sections
│   │   ├── layout/         # Navbar and footer
│   │   ├── results/        # Dashboard, metrics, and finding cards
│   │   └── ui/             # Reusable UI components
│   ├── lib/
│   │   ├── ai/             # NVIDIA client, prompts, and AI validation
│   │   ├── parsing/        # Future document parsing modules
│   │   ├── scoring/        # Risk scoring and metrics
│   │   └── utils.ts        # Shared styling utilities
│   └── types/              # Shared TypeScript domain types
├── tests/                  # Automated tests
├── .env.example            # Environment variable template
├── package.json            # Scripts and dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Requirements

Install these tools before running the project:

- Node.js 18.18 or newer
- npm 9 or newer
- A NVIDIA NIM API key for running real analyses

## Run the project locally

### 1. Clone the repository

```bash
git clone https://github.com/MM-Tiwari/UNK.git
cd UNK
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Create the environment file

Copy the example file:

```bash
cp .env.example .env.local
```

Then open `.env.local` and add your NVIDIA API key:

```env
NVIDIA_API_KEY=your_nvidia_api_key_here
AI_MODEL=openai/gpt-oss-20b
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
MAX_INPUT_TOKENS=16000
```

Do not commit `.env.local` or share your API key.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run lint` | Check the code with ESLint. |
| `npm test` | Run the automated tests. |
| `npm run build` | Create a production build. |
| `npm run start` | Start the production build locally. |

Before committing changes, it is useful to run:

```bash
npm run lint
npm test
npm run build
```

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NVIDIA_API_KEY` | Yes for AI analysis | API key used to call NVIDIA NIM. |
| `AI_MODEL` | No | Model name. Defaults to `openai/gpt-oss-20b`. |
| `NVIDIA_BASE_URL` | No | NVIDIA-compatible API base URL. |
| `MAX_INPUT_TOKENS` | No | Approximate input token budget. Defaults to `16000`. |

The API key is read only by the server-side analysis route. It is not sent to the browser.

## Deploying the project

UNK is suitable for a portfolio or learning-project deployment on a Next.js-compatible hosting platform such as Vercel.

General deployment steps:

1. Import the GitHub repository into your hosting provider.
2. Select the `main` branch.
3. Add the environment variables listed above.
4. Deploy the project using the default Next.js settings.
5. Open the deployed `/analyze` page.
6. Run a test analysis.

After deployment, add your links to the **Live Links** section at the top of this README.

## Current limitations

This is a portfolio and learning project. The following features are not implemented yet:

- PDF and DOCX document parsing
- User accounts and authentication
- Database-backed analysis history
- Sharing results with other users
- Report export to PDF, Markdown, or JSON
- GitHub Issues, Linear, or Jira export
- Production rate limiting
- Advanced monitoring and analytics

Current results are stored in browser `sessionStorage`, so they are temporary and are not available as a permanent account history.

## Roadmap

- [x] Responsive landing page and analysis interface
- [x] NVIDIA NIM AI integration
- [x] Structured AI response validation with Zod
- [x] Deterministic risk scoring
- [x] Results dashboard with categories and metrics
- [x] Error handling for common AI and network failures
- [x] Automated tests for core logic
- [ ] PDF and DOCX parsing
- [ ] Report export
- [ ] Persistent storage and analysis history
- [ ] Authentication and collaboration
- [ ] Issue tracker integrations

## Security notes

- Keep `NVIDIA_API_KEY` in `.env.local` or your hosting provider's secret manager.
- Never commit real API keys to GitHub.
- Do not paste confidential information into a public deployment unless you understand how the AI provider processes it.
- The current project does not provide authentication or permanent data deletion controls.

## Resume description

> Built UNK, a full-stack Next.js and TypeScript application that uses NVIDIA NIM and structured adversarial prompts to identify hidden assumptions, dependencies, failure modes, edge cases, and missing evidence in system and project proposals. Implemented server-side API key protection, Zod validation, deterministic risk scoring, a responsive results dashboard, automated tests, and production build verification.

## License

No license has been added yet. Add a license file if you plan to distribute or open-source the project.

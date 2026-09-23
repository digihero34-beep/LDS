# Note for Evaluator / Recruiter

> **Submission for CipherSchools Engineering Assignment**  
> **Project**: Low-Level Design (LLD) Practice Platform — *Engineering Design Review Workbench*  
> **Repository**: [https://github.com/digihero34-beep/LDS](https://github.com/digihero34-beep/LDS)  
> **Branch**: `main`

---

## 1. Quickstart (Run Locally in 60 Seconds)

The repository is configured for immediate, zero-friction local testing:

```bash
# 1. Clone repository
git clone https://github.com/digihero34-beep/LDS.git
cd LDS

# 2. Install dependencies
npm install

# 3. Environment Setup (Pre-configured for local & cloud)
cp .env.example .env
# (The project works with zero external config: SQLite/Neon PostgreSQL + Groq LLM / fallback)

# 4. Run Development Server
npm run dev

# 5. Open in browser:
http://localhost:3000
```

To run the automated test suite:
```bash
npm test          # 19 passing Vitest tests across Domain, Evaluator, and Use Cases
npm run build     # Verifies clean Next.js 14 production bundle (12 static/dynamic routes)
```

---

## 2. Recommended 3-Minute Evaluation Walkthrough

Follow this path to observe the entire architecture in action:

| Step | Action | URL / Location | What to Observe |
| :--- | :--- | :--- | :--- |
| **1. Landing & Circuit** | Visit homepage | `http://localhost:3000/` | Interactive animated SVG architecture circuit, metrics ticker, and challenge preview. |
| **2. Instant Demo** | Click **"Run Pre-Flight Inspection →"** | `/practice/preview-demo` | Automatically initializes a session, pre-seeds the design sheet, and launches into the workspace. |
| **3. Interactive Wireframing** | Hover over relationships in **Section 04** | `/practice/[attemptId]` | Connected entity cards in **Section 03** dynamically illuminate (`◀ SOURCE ENTITY` / `▶ TARGET ENTITY`), proving real-time graph connectivity. |
| **4. Live Telemetry** | Edit class fields or trade-offs | Top Bar & Right Rail | Notice the live autosave radar ping (`Saved (Live Sync)`), and watch the 6-signal Review Readiness meter update in real time. |
| **5. AST Laser Evaluation** | Click **Review & Submit** → Confirm | `/attempts/[attemptId]/evaluation` | The Blueprint AST Scanner sweeps down with a 4-phase terminal ticker while the Groq AI evaluator critiques your design against the 5-part LLD rubric. |
| **6. Evidence Feedback** | Inspect the rubric report | `/attempts/[attemptId]/evaluation` | Structured evidence cards featuring `OBSERVED`, `EVIDENCE` citation, `WHY IT MATTERS`, `RECOMMENDED REVISION`, and calibrated `CONFIDENCE`. |
| **7. Attempt Evolution** | Click **"Create Improved Attempt"** | `/attempts/compare` | Semantic side-by-side diff comparing entity additions, relationship changes, score deltas, and targeted next challenges. |

---

## 3. Core Architectural Highlights

### A. Clean Domain-Driven Design (Hexagonal Architecture)
* **Domain Layer** ([`src/domain/`](file:///e:/Ciphers%20School/src/domain/)): Contains zero framework dependencies (no Next.js, no Prisma). Defines pure domain aggregates (`Problem`, `Attempt`, `Submission`, `Rubric`, `Evaluation`) and the strict Attempt State Machine (`DRAFT → SUBMITTED → EVALUATING → COMPLETED / FAILED`).
* **Application Layer** ([`src/application/`](file:///e:/Ciphers%20School/src/application/)): Encapsulates all business use cases (`CreateAttempt`, `SaveDraft`, `SubmitAttempt`, `EvaluateAttempt`, `RetryEvaluation`, `CompareAttempts`).
* **Infrastructure Layer** ([`src/infrastructure/`](file:///e:/Ciphers%20School/src/infrastructure/)): Encapsulates database repositories, deterministic AST evaluators, and LLM adapters.

### B. Durable Handoff Invariant (Zero Data Loss)
* In [src/application/attempts/submitAttempt.ts](file:///e:/Ciphers%20School/src/application/attempts/submitAttempt.ts), the user's submission is **persisted with status `SUBMITTED` to the database *before* external evaluation begins**.
* If an external AI provider experiences a rate limit or network timeout, the user's design is **never lost**. The attempt enters `FAILED` state, and the user can trigger an instant 1-click retry without re-submitting.

### C. Resilient Hybrid Evaluator
* [src/infrastructure/evaluator/CompositeEvaluator.ts](file:///e:/Ciphers%20School/src/infrastructure/evaluator/CompositeEvaluator.ts) implements a resilient multi-tier pipeline:
  1. **Deterministic Pre-checks**: Validates class graph integrity, missing responsibilities, and circular dependencies before submission.
  2. **AI Evaluator**: Calls Groq (`qwen/qwen3.8-27b`) or Google Gemini with Zod-enforced JSON schema output.
  3. **Offline Fallback Engine**: If the LLM call times out (>30s) or fails, the platform automatically falls back to the deterministic `HeuristicEvaluator` to guarantee evaluation completion.

### D. Purpose-Built Design Review UI
* Strict adherence to the **Engineering Design Review Workbench** design system (editorial typography with `Space Grotesk` and `JetBrains Mono`, slate borders, and tactile micro-animations).
* **No generic template patterns**: Avoided cartoon bounces, giant hero illustrations, and neon cyberpunk motifs in favor of a focused, high-density developer tool.

---

## 4. Test Suite & Code Quality Metrics

* **Vitest Automated Tests**: **19/19 passing tests** ([`tests/`](file:///e:/Ciphers%20School/tests/)):
  * Domain invariant and state machine transition tests
  * Deterministic AST validation tests
  * Full end-to-end practice loop tests (Choose → Start → Draft → Submit → Evaluate → Compare)
  * Transient failure recovery and idempotency tests
* **TypeScript Compilation**: `npx tsc --noEmit` exits with **0 errors**.
* **Production Build**: `npm run build` compiles **12/12 static & dynamic routes** into an optimized production bundle.

---

## 5. Key File Index for Review

| Component | File Path | What to Review |
| :--- | :--- | :--- |
| **Attempt State Machine** | [`src/domain/attempt/Attempt.ts`](file:///e:/Ciphers%20School/src/domain/attempt/Attempt.ts) | Strict state transition rules and invariants. |
| **Submission Invariants** | [`src/domain/submission/Submission.ts`](file:///e:/Ciphers%20School/src/domain/submission/Submission.ts) | Domain validation of design sheet integrity. |
| **Submit & Persist Flow** | [`src/application/attempts/submitAttempt.ts`](file:///e:/Ciphers%20School/src/application/attempts/submitAttempt.ts) | "Persist before evaluate" execution guarantee. |
| **Deterministic AST Rules** | [`src/infrastructure/evaluator/DeterministicEvaluator.ts`](file:///e:/Ciphers%20School/src/infrastructure/evaluator/DeterministicEvaluator.ts) | Graph integrity, duplicate detection, and responsibility audits. |
| **AI Evaluator Adapter** | [`src/infrastructure/evaluator/AIEvaluator.ts`](file:///e:/Ciphers%20School/src/infrastructure/evaluator/AIEvaluator.ts) | LLM prompt engineering and Zod schema parsing. |
| **Practice Workbench** | [`src/app/practice/[attemptId]/page.tsx`](file:///e:/Ciphers%20School/src/app/practice/%5BattemptId%5D/page.tsx) | Interactive schematic linking, autosave, and multi-section editor. |
| **Evaluation Scanner** | [`src/app/attempts/[attemptId]/evaluation/page.tsx`](file:///e:/Ciphers%20School/src/app/attempts/%5BattemptId%5D/evaluation/page.tsx) | AST laser scanner and evidence block presentation. |

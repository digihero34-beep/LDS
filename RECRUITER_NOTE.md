# Recruiter & Evaluator Brief

> **Project**: Low-Level Design (LLD) Practice Platform — *Engineering Design Review Workbench*  
> **Repository**: [https://github.com/digihero34-beep/LDS](https://github.com/digihero34-beep/LDS) (`main`)

---

### 1. Quickstart (60 Seconds)

```bash
git clone https://github.com/digihero34-beep/LDS.git && cd LDS
npm install
npm run dev
# Open http://localhost:3000
```
* **Run Tests**: `npm test` (**19/19 passing Vitest tests**)
* **Production Build**: `npm run build` (**12/12 routes compiled, 0 errors**)

---

### 2. Fast Evaluation Tour (2 Minutes)

1. **Instant Demo**: On `http://localhost:3000`, click **"Run Pre-Flight Inspection →"** to launch directly into an active, pre-populated Parking Lot session (`/practice/[id]`).
2. **Interactive Schematic Linking**: In **Section 04 (Relationships)**, hover over any relationship card—connected entity cards in **Section 03** instantly light up with `SOURCE` / `TARGET` focus rings.
3. **Live Telemetry & Autosave**: Edit any field to see the live radar ping (`Saved (Live Sync)`) and real-time 6-signal Review Readiness meter update.
4. **AST Scanner & AI Evaluation**: Click **Review & Submit** → watch the laser AST scanline and 4-stage terminal ticker while Groq AI evaluates the design against the 5-part LLD rubric.
5. **Evidence Review**: Inspect structured findings with `OBSERVED`, `EVIDENCE` code citations, `WHY IT MATTERS`, and `RECOMMENDED REVISION`.
6. **Attempt Diff**: Click **"Create Improved Attempt"** to view side-by-side semantic diffs and targeted next challenge recommendations.

---

### 3. Engineering Highlights

* **Clean Hexagonal Architecture**: Strict separation of Domain (`src/domain`), Application Use Cases (`src/application`), and Infrastructure (`src/infrastructure`). Zero framework dependencies in domain entities.
* **Durable Handoff (Zero Data Loss)**: Designs are persisted as `SUBMITTED` *before* calling external AI. If network/API fails, the submission is safe and allows instant 1-click retry.
* **Hybrid Evaluation Resilience**: Groq LLM (`qwen/qwen3.8-27b`) with Zod-validated JSON output + automatic fallback to local deterministic heuristic evaluation if AI times out.
* **Tactile Design System**: Built with `Space Grotesk`, `JetBrains Mono`, and custom CSS micro-animations (wireframe highlighting, telemetry radar, laser scanline).

---

### 4. Key Code Pointers

| File | Purpose |
| :--- | :--- |
| [`src/domain/attempt/Attempt.ts`](https://github.com/digihero34-beep/LDS/blob/main/src/domain/attempt/Attempt.ts) | State machine (`DRAFT → SUBMITTED → EVALUATING → COMPLETED`) |
| [`src/application/attempts/submitAttempt.ts`](https://github.com/digihero34-beep/LDS/blob/main/src/application/attempts/submitAttempt.ts) | "Persist before evaluate" execution guarantee |
| [`src/infrastructure/evaluator/AIEvaluator.ts`](https://github.com/digihero34-beep/LDS/blob/main/src/infrastructure/evaluator/AIEvaluator.ts) | LLM prompt design & Zod schema validation |
| [`src/infrastructure/evaluator/CompositeEvaluator.ts`](https://github.com/digihero34-beep/LDS/blob/main/src/infrastructure/evaluator/CompositeEvaluator.ts) | Multi-tier AI + heuristic fallback engine |
| [`src/app/practice/[attemptId]/page.tsx`](https://github.com/digihero34-beep/LDS/blob/main/src/app/practice/%5BattemptId%5D/page.tsx) | Workbench UI, interactive wireframe highlighting & live sync |

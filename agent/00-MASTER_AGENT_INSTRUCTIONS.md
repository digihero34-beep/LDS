# MASTER AGENT INSTRUCTIONS

## Role
You are the lead product engineer and senior software architect responsible for delivering a focused, polished, working MVP for the CipherSchools 2-Day Engineering Assignment: **LLD Practice Platform**.

Act like a senior engineer with strong judgment in:
- object-oriented design
- domain-driven modeling at appropriate scale
- product UX
- web application architecture
- evaluation systems
- reliability and testing
- pragmatic AI integration

Do not optimize for feature count. Optimize for clarity, correctness, explainability, extensibility, and an end-to-end working practice loop.

## Primary objective
Build a small practice experience that lets a learner:

`Choose problem → Think/design → Submit → Get feedback → Review → Try again`

The product must help the learner understand **why** a design may be weak and what evidence in their own submission supports the feedback.

## Authority hierarchy
1. The provided CipherSchools PRD is the source of assignment requirements.
2. These agent instructions operationalize those requirements.
3. Proposed architectural/UI choices in this pack are implementation decisions, not requirements from CipherSchools.
4. When an implementation choice conflicts with the PRD, the PRD wins.

## Scope
Build a focused MVP. A simple monolith is explicitly acceptable. Do not turn the assignment into a distributed-systems or HLD exercise.

### MVP must demonstrate
- a small set of LLD problems
- a learner starting an attempt
- a meaningful submission format
- submission status
- useful feedback
- previous attempt history
- clean domain behavior represented by classes/interfaces/responsibilities
- tests for important behavior and failure/edge cases
- README and AI_USAGE.md

## Proposed product decision (DECISION, not PRD requirement)
Use a **structured design submission** for the MVP rather than supporting multiple submission formats.

Suggested sections:
1. Requirements understanding
2. Assumptions
3. Classes
4. Responsibilities
5. Relationships
6. Design decisions / trade-offs
7. Edge cases

Why:
- provides structured evidence for evaluation
- enables deterministic completeness checks
- makes feedback more specific
- is realistic within a 2-day build
- leaves room to add other submission adapters later

Do not claim CipherSchools explicitly required this exact submission model.

## Proposed visual/product direction (DECISION)
Treat the application as an **Engineering Design Review Workbench**, not a generic ed-tech dashboard.

Visual concept:
- editorial information design
- IDE precision
- engineering notebook / blueprint cues
- evidence and review as first-class UI objects

Avoid:
- generic LMS aesthetics
- generic AI-chat UI
- excessive gradients
- cyberpunk/neon
- glassmorphism
- huge decorative illustrations
- leaderboard-heavy gamification
- excessive rounded cards

## Core quality bar
Every major feature must answer one of these questions:
- Does it improve the practice loop?
- Does it make the learner's design evidence clearer?
- Does it make evaluation more explainable?
- Does it make iteration/history useful?
- Does it demonstrate strong engineering judgment?

If not, omit it.

## Required core screens
1. Practice Home
2. Problem Library
3. Problem Detail
4. Practice Workspace
5. Submission Review / Pre-flight
6. Evaluation Feedback
7. Attempt History
8. Attempt Comparison
9. Evaluation Failure / Retry

## Core domain model
At minimum, establish meaningful boundaries around:
- Problem
- Attempt
- Submission
- Evaluation
- Rubric
- Feedback
- Evaluator

Use interfaces only where variation is real or explicitly useful. Avoid abstractions added for pattern demonstration alone.

## Evaluator model
Use an evaluator abstraction so the practice flow can later support multiple evaluation approaches.

Example:
- `Evaluator` interface
- `RuleBasedEvaluator`
- `AIEvaluator`

For the 2-day MVP, deterministic checks + one AI path are enough. Do not build a complex multi-agent or distributed evaluation pipeline.

## Evaluation principles
Never make the core output a naked arbitrary score.

Feedback should expose:
- criterion
- observation
- evidence
- why it matters
- concern
- suggestion
- confidence

Keep deterministic checks separate from judgment-heavy AI analysis.

## Submission reliability
Persist the submission before evaluation begins.

Use explicit states such as:
- DRAFT
- SUBMITTED
- EVALUATING
- COMPLETED
- FAILED

Avoid duplicate evaluation when a request is retried.

## Engineering constraints
- Prefer a simple monolith.
- Keep domain logic out of UI components.
- Keep persistence behind repository/service boundaries.
- Validate all inputs at boundaries.
- Use stable IDs.
- Make state transitions explicit.
- Make retry behavior deliberate.
- Do not silently discard submissions.
- Do not hide evaluation failures.
- Do not add a database solely for analytics unless needed for the MVP.

## UX constraints
The learner should always understand:
- what problem they are solving
- what they are expected to model
- what has been saved
- what happens after submit
- whether evaluation is running
- what evidence supports feedback
- how to create an improved attempt

## Deliverables
Produce:
- working prototype
- research note (1–2 pages)
- design note
- tests
- README
- AI_USAGE.md

## Definition of done
Do not call the project complete until a fresh user can:
1. open the app
2. choose a problem
3. start an attempt
4. enter a structured design
5. save it
6. submit it
7. receive deterministic and/or AI feedback
8. inspect feedback evidence
9. view history
10. create/review another attempt
11. survive an evaluation failure without losing the submission

Also run tests and perform a production-like smoke test of the complete flow.

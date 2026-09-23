# 2-DAY IMPLEMENTATION PLAN

## Operating principle
Build vertical slices, not isolated layers for hours. By the end of each phase, a meaningful user flow should work.

## DAY 1 — PRODUCT CORE

### Phase 1 — Project setup and domain (1–2 hours)
- inspect repo
- preserve existing tooling where possible
- set TypeScript strictness
- set environment variables safely
- establish folder structure
- implement domain enums/types
- implement state transition rules
- implement core entities

Exit criteria:
- project starts
- domain types compile
- invalid state transitions are rejected

### Phase 2 — Persistence and seed data (1–2 hours)
- schema/migrations
- repositories
- seed 3–5 problems
- test basic CRUD

Exit criteria:
- database works
- problems render from persisted data

### Phase 3 — Problem library/detail (1–2 hours)
Implement:
- list
- filters
- problem detail
- start attempt

Exit criteria:
- user can select a problem and create DRAFT attempt

### Phase 4 — Practice workspace (3–4 hours)
Implement:
- structured design editor
- classes
- relationships
- assumptions
- design decisions
- edge cases
- autosave or manual save
- draft version/status

Exit criteria:
- user can create meaningful structured submission
- refresh does not lose saved draft

## DAY 2 — EVALUATION AND POLISH

### Phase 5 — Submission + deterministic validator (1–2 hours)
Implement:
- pre-flight review
- required field validation
- duplicate class checks
- relationship reference checks
- transition validation
- safe submit

Exit criteria:
- invalid submissions are blocked
- valid submission is persisted before evaluation

### Phase 6 — Evaluation engine (2–3 hours)
Implement:
- Evaluator interface
- deterministic evaluator
- AI evaluator adapter
- fixed rubric
- structured result parser/validator
- persistence of evaluation and feedback

Exit criteria:
- successful evaluation works
- malformed AI output fails safely
- provider failure leaves submission intact

### Phase 7 — Feedback/history/comparison (2–3 hours)
Implement:
- evidence-first feedback
- attempt history
- comparison
- retry evaluation
- failed evaluation state

Exit criteria:
- learner can complete loop and retry

### Phase 8 — QA/documentation/polish (2–3 hours)
- unit tests
- integration tests
- smoke test
- responsive pass
- accessibility pass
- loading/error states
- README
- research note
- design note
- AI_USAGE.md

## Stop rules
At least 4–6 hours before deadline, stop adding features.
Use remaining time for:
- bugs
- edge cases
- UI consistency
- evaluator robustness
- documentation
- demo readiness

## Demo path to verify
1. Open Home
2. Choose Parking Lot
3. Start Attempt
4. Fill design
5. Save
6. Submit
7. Show Evaluating
8. Show Feedback
9. Open evidence
10. Compare with previous attempt
11. Trigger or simulate evaluation failure
12. Retry

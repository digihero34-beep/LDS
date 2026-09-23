# AI Usage Record

In accordance with the CipherSchools engineering assignment deliverables, this document details four meaningful architectural decisions influenced by AI assistance during the system design and implementation of the **LLD Practice Platform (Architect Workbench)**.

---

## Decision 1 — Structured Design Sheet vs. Graphical UML Canvas

### What AI suggested
AI initially proposed an interactive web canvas using a client-side diagramming engine (such as React Flow, Mermaid-live, or Konva) where learners drag, drop, and link UML class blocks with visual connection arrows.

### What I accepted
I accepted the concept of capturing classes, attributes, methods, and relationships as explicit, machine-readable entities rather than freeform text or code compilation.

### What I rejected
I rejected the graphical drag-and-drop canvas for this 2-day MVP.

### Why
Graphical UML canvases consume disproportionate engineering bandwidth on visual layout, canvas panning/zooming, SVG connectors, and coordinate collision math without increasing the semantic quality of the Low-Level Design. More critically, visual position coordinates do not constitute evidence of architectural reasoning. A **Structured Text Design Sheet** directly captures requirements understanding, class responsibilities, relationships with explicit rationales, architectural trade-offs, and edge cases. This provides cleaner, deterministic evidence for evaluation while keeping the submission format easily extensible.

---

## Decision 2 — Persistence-Before-Evaluation Transaction Boundary

### What AI suggested
AI suggested a unified atomic pipeline that receives the client submission, runs deterministic checks, sends a prompt to the LLM, and writes the entire attempt, submission, and evaluation in a single database transaction upon receiving the LLM response.

### What I accepted
I accepted the automated transition pipeline from submission to evaluation.

### What I rejected
I rejected bundling the learner's submission persistence and the external AI evaluation into a single database transaction.

### Why
External AI provider calls are inherently non-deterministic: networks time out, rate limits occur, and LLMs occasionally return malformed payloads. If evaluation is in the same transaction as submission, an evaluator failure causes the database transaction to roll back, silently discarding the learner's submitted design. In our architecture, the submission is durably written to the database with status `SUBMITTED` *before* the evaluator is invoked. If the evaluator fails, the attempt transitions safely to `FAILED` with the submission 100% intact, and an explicit `RETRY` path is made available to the learner.

---

## Decision 3 — Evidence-Based Rubric Feedback vs. Single 100-Point Score

### What AI suggested
AI suggested computing a composite numerical score (e.g., "78/100") by asking the LLM to output a floating-point score for each rubric dimension and displaying a large circular progress gauge at the top of the review page.

### What I accepted
I accepted standardizing evaluation across 8 core LLD rubric dimensions (Requirement Understanding, Responsibility Boundaries, Coupling & Cohesion, Encapsulation & Interfaces, Abstraction & Patterns, Extensibility, Edge Cases, and Explanation Quality).

### What I rejected
I rejected making a single numerical score the primary feedback hero element.

### Why
Single numerical scores are arbitrary and demotivating in Low-Level Design because multiple distinct object models can be equally valid. An engineer practicing LLD does not benefit from knowing they received "72/100"; they need to understand *why* a design is fragile. We restructured every feedback item around:
`CRITERION → ASSESSMENT → EVIDENCE (citation) → WHY IT MATTERS → CONCERN → SUGGESTED CHANGE → CONFIDENCE`.
This shifts the product paradigm from arbitrary grading to an engineering design review.

---

## Decision 4 — Deterministic Evaluator Pre-Filter with Heuristic Fallback

### What AI suggested
AI proposed passing the raw submission payload directly to the LLM and relying on the model prompt to detect empty sections, duplicate class names, and missing relationships.

### What I accepted
I accepted using LLMs for judgment-heavy, subjective evaluations such as abstraction trade-offs, cohesion quality, and SRP boundaries.

### What I rejected
I rejected letting the LLM handle structural and syntactic integrity checks.

### Why
Using an LLM for deterministic validation is slow, costly, and brittle. Structural checks—such as ensuring class names are unique, verifying that relationship endpoints point to declared classes, and confirming non-empty responsibilities—can be verified in under 1ms using deterministic graph and set operations. We established a two-tiered evaluation architecture:
1. **Deterministic Evaluator**: Runs instant pre-checks and generates real-time signals on the workbench right panel before submission.
2. **Judgment Evaluator**: Evaluates architectural reasoning via LLM when available, and seamlessly falls back to a deterministic heuristic engine when offline.

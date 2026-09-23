# NON-NEGOTIABLE AGENT WORKING RULES

## Rule 1 — Read before changing
Before editing an existing codebase:
- inspect the repository structure
- inspect package scripts
- inspect current dependencies
- inspect existing routes/components
- inspect current database setup
- reuse working infrastructure when practical

Never overwrite a working setup blindly.

## Rule 2 — No speculative architecture
Do not add:
- microservices
- event buses
- Kafka
- Kubernetes
- service meshes
- CQRS/event sourcing
- graph databases
- elaborate workflow engines
unless a concrete requirement forces them.

## Rule 3 — Domain first
Business rules belong in domain/application layers, not inside React components or route handlers.

## Rule 4 — One source of truth for state transitions
Attempt/evaluation status changes must go through domain/application logic.
Never trust the browser to set final state.

## Rule 5 — Persistence before external evaluation
Save the learner's submission before calling an AI provider.

## Rule 6 — AI is not the system of record
AI output is untrusted external input.
Validate it against a strict schema before persisting.

## Rule 7 — Evidence over unsupported claims
Feedback must refer to actual submitted evidence. Never invent methods/classes/relationships.

## Rule 8 — No arbitrary “AI score” feature
Do not build a UI whose main purpose is displaying a single AI score.

## Rule 9 — Avoid copy-paste UI patterns
Do not turn every section into a card. Use dividers, grids, tables, structured rows, timelines, and panels appropriately.

## Rule 10 — Accessibility is part of implementation
Do not postpone keyboard/focus/contrast basics until the final hour.

## Rule 11 — Error states are product features
Implement explicit states for:
- loading
- validation errors
- evaluation in progress
- evaluation failed
- retrying
- empty history

## Rule 12 — Keep APIs small
Prefer use-case-oriented endpoints over generic CRUD when it improves clarity.

## Rule 13 — Test important behavior
Prioritize state transitions, validation, evaluator behavior, retry/idempotency, and persistence.

## Rule 14 — No fake functionality
Do not add buttons that do nothing. If a feature is not implemented, omit it or clearly mark it as unavailable where appropriate.

## Rule 15 — No invented sources
Do not fabricate research citations, product comparisons, evaluation results, or benchmarks.

## Rule 16 — Protect secrets
Never commit API keys. Never expose secrets to client-side bundles.

## Rule 17 — Keep the MVP coherent
A small polished system is better than a huge unfinished platform.

## Rule 18 — Use patterns only when justified
If using Strategy, Adapter, Repository, State Machine, etc., document the concrete variation the abstraction protects.

## Rule 19 — Preserve submission across retries
A failed evaluation is not a failed submission.

## Rule 20 — Review your own work
Before declaring done:
- inspect all main screens
- test primary flow
- test failure path
- test mobile/tablet behavior
- run tests
- inspect logs
- check documentation

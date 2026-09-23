# ARCHITECTURE

## Architecture style
Use a **modular monolith**.

Suggested stack for rapid implementation:
- Next.js
- TypeScript
- PostgreSQL
- Prisma (or an equivalent ORM if the repo already uses another ORM)
- server-side application services
- a single web application deployment

Use the repository's existing stack when already established; do not perform unnecessary framework migration during a 2-day task.

## Layering

```text
UI / Route Handlers
        |
        v
Application Services / Use Cases
        |
        v
Domain Model + Domain Services
        |
        +----------------------+
        |                      |
        v                      v
Repositories             Evaluation Ports
        |                      |
        v                      +----------+
   PostgreSQL                |          |
                              v          v
                         Deterministic   AI Adapter
                          Evaluator
```

## Layer responsibilities
### UI layer
Responsible for:
- rendering
- input collection
- local UI state
- accessibility
- calling application endpoints/actions

Must NOT contain:
- business rules
- database access
- evaluation logic
- domain state transition logic

### Application layer
Responsible for use cases:
- start attempt
- save draft
- submit attempt
- evaluate attempt
- retry evaluation
- fetch feedback
- fetch history
- compare attempts

### Domain layer
Responsible for:
- entities/value objects
- invariants
- state transitions
- business-level rules
- evaluator contract
- structured evaluation result

### Infrastructure layer
Responsible for:
- Prisma/database repositories
- AI provider adapter
- persistence mapping
- external service calls

## Use-case examples
- `CreateAttempt`
- `SaveAttemptDraft`
- `SubmitAttempt`
- `RunEvaluation`
- `RetryEvaluation`
- `GetAttempt`
- `GetAttemptHistory`
- `CompareAttempts`

## Failure behavior
When submission happens:
1. Validate required fields.
2. Persist submission.
3. Move attempt to SUBMITTED/EVALUATING as appropriate.
4. Trigger evaluation.
5. On success: persist evaluation and feedback, transition to COMPLETED.
6. On failure: persist failure state and a retryable reason; keep submission intact.

The main submission transaction must not depend on an AI response being successful.

## Practical async strategy
For a 2-day prototype, you may implement evaluation synchronously behind an application service if latency is acceptable, but the domain model and UI must still express an `EVALUATING` state.

A simpler alternative is a lightweight background job/process if the environment makes it easy. Do not add Kafka, Redis clusters, queues-as-infrastructure, or distributed orchestration merely to look senior.

## Extension points
Future variation points should be explicit:
- submission format
- evaluator implementation
- rubric version
- AI provider

Avoid coupling the entire workflow to one evaluator or one submission representation.

# DATABASE AND DATA STRUCTURES

## Persistence goal
Use the database to store durable learning evidence and evaluation history, not to create an overengineered analytics system.

## Recommended tables

### `problems`
- `id` UUID/string primary key
- `slug` unique
- `title`
- `difficulty`
- `estimated_minutes`
- `summary`
- `requirements` JSON/text structure
- `constraints` JSON/text structure
- `evaluation_hints` JSON/text structure
- `active`
- timestamps

### `attempts`
- `id`
- `problem_id` FK
- `attempt_number`
- `status`
- timestamps
- unique(problem_id, attempt_number) if attempts are global, or include learner_id if authentication exists

### `submissions`
- `id`
- `attempt_id` FK unique for MVP if one final submission is enough, or versioned if drafts/submission versions are retained
- `version`
- structured payload JSONB OR normalized tables where clarity requires it
- checksum/hash optional for idempotency
- timestamps

### `evaluations`
- `id`
- `attempt_id`
- `submission_id`
- `evaluator_type`
- `rubric_version`
- `status`
- `summary`
- `failure_reason`
- timestamps

### `feedback`
- `id`
- `evaluation_id`
- `criterion`
- `severity`
- optional score
- observation
- evidence
- why_it_matters
- concern
- suggestion
- confidence

### `rubrics`
- `id`
- `version` unique
- criteria JSON/text structure
- active
- timestamps

## Data structure choices
Use structures that match the behavior:
- arrays for ordered assumptions, classes, relationships, edge cases
- maps/dictionaries for criterion lookup when evaluating
- sets internally for duplicate detection
- enums for finite state/status/type values
- immutable evaluation result objects after completion when practical

Do not use a tree, graph database, event store, or document engine unless the concrete MVP requirement demands it.

## Idempotency
Evaluation requests should accept an idempotency key, submission version, or deterministic evaluation token.

The system should not:
- generate multiple simultaneous evaluations for the same submission without intent
- create duplicate feedback sets because the user double-clicked Submit

## Persistence before AI
Persist the submission before calling any external AI provider.

AI provider failure must not erase learner work.

## Seed data
Ship at least 3–5 problems.
Suggested:
- Parking Lot
- Elevator
- Vending Machine
- Notification Service
- Library Management

The specific list is a product decision; what matters is a small, varied set with clear requirements.

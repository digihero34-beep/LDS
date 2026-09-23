# DOMAIN MODEL

## Design principle
The assignment is itself an opportunity to demonstrate LLD. Model the product with clear responsibilities, interfaces, behavior, relationships, and extensibility without over-abstraction.

## Core entities

### Problem
Owns the LLD challenge definition.

Suggested fields:
- id
- slug
- title
- difficulty
- estimatedMinutes
- summary
- requirements
- constraints
- evaluationHints
- active
- createdAt
- updatedAt

Responsibilities:
- expose problem requirements/context
- define the challenge metadata

Not responsible for:
- learner progress
- evaluation execution

### Attempt
Represents one learner attempt for one problem.

Suggested fields:
- id
- problemId
- attemptNumber
- status
- startedAt
- submittedAt
- completedAt
- createdAt
- updatedAt

Responsibilities:
- own attempt lifecycle
- enforce legal state transitions
- provide attempt identity

### Submission
Represents the learner's actual design evidence.

Suggested structured fields:
- id
- attemptId
- version
- requirementsUnderstanding
- assumptions[]
- classes[]
- relationships[]
- designDecisions[]
- edgeCases[]
- createdAt
- updatedAt

Potential future abstraction:
`SubmissionContent` / `SubmissionPayload` so future formats can be added.

### ClassDesign
Represents a learner-defined class/interface abstraction.

Suggested fields:
- name
- kind: CLASS | INTERFACE | ABSTRACT_CLASS
- responsibility
- methods[]
- attributes[]
- dependencies[]

Keep this model intentionally small.

### Relationship
Suggested fields:
- fromClass
- type
- toClass
- rationale

Examples:
- CONTAINS
- USES
- IMPLEMENTS
- EXTENDS
- DEPENDS_ON

### DesignDecision
Captures intentional trade-offs.

Suggested fields:
- title
- decision
- rationale
- alternativesConsidered (optional)

### EdgeCase
Suggested fields:
- scenario
- expectedBehavior
- notes

### Evaluation
Represents one evaluation execution/result.

Suggested fields:
- id
- attemptId
- evaluatorType
- rubricVersion
- status
- overallSummary
- startedAt
- completedAt
- failedAt
- failureReason

Do not make `score` the only meaningful output.

### Feedback
Represents criterion-level review.

Suggested fields:
- id
- evaluationId
- criterion
- severity
- score (optional)
- observation
- evidence
- whyItMatters
- concern
- suggestion
- confidence
- createdAt

### Rubric
Represents the evaluation contract.

Suggested fields:
- id/version
- criteria[]
- active

A rubric should be versioned so evaluation output remains explainable even when criteria evolve.

## Evaluator abstraction

```ts
interface Evaluator {
  evaluate(input: EvaluationInput): Promise<EvaluationResult>;
}
```

Potential implementations:

```text
Evaluator
├── DeterministicEvaluator
└── AIEvaluator
```

A composite evaluator may orchestrate both without exposing provider details to the domain.

## State machine
Allowed lifecycle:

```text
DRAFT
  |
  v
SUBMITTED
  |
  v
EVALUATING
  |       \
  |        \---> FAILED
  v                 |
COMPLETED <---------+
        ^
        |
   RETRY EVALUATION
```

Preferred explicit transition rules:
- DRAFT → SUBMITTED
- SUBMITTED → EVALUATING
- EVALUATING → COMPLETED
- EVALUATING → FAILED
- FAILED → EVALUATING

Disallow invalid transitions such as:
- COMPLETED → SUBMITTED
- DRAFT → COMPLETED
- FAILED → COMPLETED without a successful evaluation

## Invariants
- An attempt belongs to exactly one problem.
- A submission belongs to exactly one attempt.
- Only one active evaluation should process an attempt at a time.
- Evaluation retry must not create duplicate submissions.
- Completed evaluation must reference the saved submission version it evaluated.
- Feedback must reference a criterion from the evaluation's rubric version.
- Attempt number should be deterministic for a learner/problem pair.

## Change test A
Today: structured text submission.
Later: class diagram submission.

The practice flow should not need to be rewritten. Keep the representation behind a submission boundary.

## Change test B
Today: one evaluator.
Later: rule-based evaluator or human reviewer.

The practice flow should depend on `Evaluator`, not on a concrete provider.

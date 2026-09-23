# TESTING AND QA

## Test philosophy
Test the behavior that demonstrates engineering judgment, not every line of UI code.

## Domain tests
Must cover:
- valid attempt state transitions
- invalid transitions rejected
- unique attempt numbering behavior
- submission linked to correct attempt
- duplicate class detection
- invalid relationship endpoint rejection
- duplicate relationship detection

## Deterministic evaluator tests
Examples:
- missing required section
- class without responsibility
- unknown relationship endpoint
- duplicate class name with case variation
- empty submission
- valid submission

## Evaluation lifecycle tests
Cover:
1. submission saved before evaluator call
2. evaluation success → COMPLETED
3. evaluation failure → FAILED
4. failed submission remains accessible
5. retry reuses same submission
6. retry does not create duplicate attempt
7. duplicate submit is handled safely

## AI adapter tests
Mock the external provider.

Test:
- valid structured JSON
- missing criterion
- malformed JSON
- unexpected score type
- timeout/provider error
- invented evidence rejection or detection when feasible

## API/integration tests
At minimum:
- get problems
- start attempt
- save draft
- submit
- fetch evaluation
- retry failed evaluation
- fetch history

## UI smoke tests
Manual:
- desktop
- tablet
- mobile

Verify:
- keyboard focus
- visible status
- loading state
- empty state
- validation errors
- failure recovery
- no lost submission

## Acceptance criteria
A submission is accepted only if:
- the end-to-end loop works
- evaluator output is understandable
- the feedback points to evidence in the learner's design
- attempt history is visible
- evaluation failure does not lose data
- important domain behavior has automated tests
- no critical console/runtime errors remain

## Performance sanity
Do not over-optimize. Ensure:
- problem list loads quickly
- draft saves do not trigger AI
- feedback page does not request duplicate evaluations
- long submissions do not create unbounded request payloads

# API AND APPLICATION FLOW

## Goal
Keep the API small and aligned with use cases.

Possible routes:
- `GET /api/problems`
- `GET /api/problems/:id`
- `POST /api/attempts`
- `GET /api/attempts/:id`
- `PATCH /api/attempts/:id/draft`
- `POST /api/attempts/:id/submit`
- `POST /api/attempts/:id/evaluation/retry`
- `GET /api/problems/:id/attempts`
- `GET /api/attempts/:id/evaluation`
- `GET /api/attempts/compare?from=...&to=...`

The exact routing style can follow the chosen framework, but semantics should remain equivalent.

## Start attempt
Input:
- problemId

Steps:
1. Validate problem exists and is active.
2. Allocate attempt number.
3. Create attempt in DRAFT.
4. Create empty draft submission if convenient.
5. Return attempt.

## Save draft
Input:
- structured submission payload
- optional version

Steps:
1. Validate shape.
2. Validate field-level constraints.
3. Persist latest draft.
4. Return save timestamp/version.

Do not invoke AI on autosave.

## Submit
Steps:
1. Validate required structure.
2. Run deterministic completeness checks.
3. Return blocking errors if required input is missing.
4. Persist final submission/version.
5. Atomically transition attempt to SUBMITTED/EVALUATING.
6. Start evaluation.
7. Return status and attempt ID.

Double-submit behavior must be safe.

## Evaluate
Input:
- attemptId
- submissionId
- evaluation token/idempotency key

Steps:
1. Confirm attempt state permits evaluation.
2. Create evaluation record as EVALUATING.
3. Run deterministic checks.
4. Run AI analysis if configured.
5. Combine results into structured evaluation result.
6. Persist feedback.
7. Transition evaluation and attempt to COMPLETED.
8. On failure, persist FAILED and keep submission intact.

## Retry
Only FAILED evaluations should be retryable.

Retry should:
- reuse the saved submission
- create a new evaluation execution if desired
- not create a new learner attempt
- not duplicate submission content

## History
History should return:
- attempt number
- attempt status
- last evaluation summary
- major strengths
- major concerns
- timestamps

## Comparison
Compare two evaluation snapshots, not two mutable drafts.

Return conceptual differences:
- added
- removed
- changed
- improved
- unresolved

## Error handling
Use stable error categories:
- `VALIDATION_ERROR`
- `NOT_FOUND`
- `INVALID_STATE`
- `DUPLICATE_REQUEST`
- `EVALUATION_FAILED`
- `INTERNAL_ERROR`

Never expose raw AI provider errors to the user.

## Security basics
- Validate all external inputs.
- Never trust client-provided status.
- Never expose AI keys to the browser.
- Limit payload sizes.
- Avoid logging sensitive learner content unnecessarily.
- Do not store raw secrets in source control.

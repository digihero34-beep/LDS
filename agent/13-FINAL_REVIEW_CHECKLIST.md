# FINAL REVIEW CHECKLIST

## PRD coverage
- [ ] Small set of problems exists
- [ ] Learner can start an attempt
- [ ] Learner can provide meaningful design evidence
- [ ] Submission has clear status
- [ ] Feedback is useful and explainable
- [ ] Previous attempts are visible
- [ ] Core domain behavior is represented with clear classes/interfaces

## Product
- [ ] Practice loop is obvious
- [ ] UX is purpose-built for LLD
- [ ] No feature sprawl
- [ ] Design has a distinctive visual language
- [ ] Feedback explains evidence and action
- [ ] Attempt history supports improvement

## Engineering
- [ ] Monolith is coherent
- [ ] UI does not contain business rules
- [ ] Domain/application boundaries are understandable
- [ ] State transitions are explicit
- [ ] AI is behind an abstraction
- [ ] Submission is persisted before AI evaluation
- [ ] Retry does not duplicate submissions
- [ ] External AI output is schema-validated

## Data
- [ ] IDs are stable
- [ ] Constraints and uniqueness are defined
- [ ] Evaluation references the exact submission it evaluated
- [ ] Rubric version is stored

## Evaluation
- [ ] Deterministic checks work
- [ ] AI prompt is rubric-based
- [ ] Feedback cites real evidence
- [ ] Confidence is represented
- [ ] Failure path is implemented
- [ ] Retry path is implemented

## Testing
- [ ] Domain tests pass
- [ ] Evaluation tests pass
- [ ] Failure/edge tests pass
- [ ] API/integration tests pass where implemented
- [ ] Manual smoke flow passes

## UI
- [ ] Workspace is the strongest screen
- [ ] Feedback is the strongest explanatory screen
- [ ] Attempt comparison is understandable
- [ ] Loading/error/empty states exist
- [ ] Responsive layout works
- [ ] Keyboard focus is visible
- [ ] Colors are not the only status signal

## Documentation
- [ ] README complete
- [ ] Research note complete
- [ ] Design note complete
- [ ] AI_USAGE.md has 3–5 real decisions
- [ ] Trade-offs and limitations are honest
- [ ] Run/test instructions work from a clean checkout

## Final demo narrative
Be able to explain in a few minutes:
1. What learner problem is being solved?
2. Why was this submission format chosen?
3. Which checks are deterministic?
4. Which checks use AI and why?
5. How is feedback tied to evidence?
6. How can another evaluator be added?
7. What happens if evaluation fails?
8. Why is the architecture intentionally simple?

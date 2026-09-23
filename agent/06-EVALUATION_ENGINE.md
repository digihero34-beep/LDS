# EVALUATION ENGINE

## Evaluation philosophy
LLD has multiple valid solutions. Therefore evaluation should judge dimensions rather than compare the learner against one canonical class diagram.

Primary dimensions:
1. Requirement understanding
2. Class responsibilities
3. Coupling / cohesion
4. Encapsulation and interfaces
5. Abstraction / pattern appropriateness
6. Extensibility
7. Edge cases and testability
8. Explanation quality

## Deterministic checks
Perform these before AI:
- required fields present
- at least one class defined
- each class has a responsibility
- relationship endpoints refer to known classes
- relationship type is valid
- no duplicate class names (case-insensitive)
- no duplicate relationship tuple
- state transition is legal
- submission is linked to correct attempt
- retry does not create duplicate active evaluation

These checks should be fast, testable, and deterministic.

## AI responsibilities
Use AI for judgment-heavy analysis:
- responsibility quality
- questionable coupling
- abstraction choices
- trade-offs
- requirement interpretation quality
- edge-case completeness
- improvement suggestions

Do not ask:
> “Is this design good? Give it a score out of 100.”

Instead use a fixed rubric and structured output.

## Suggested evaluator contract

```ts
interface EvaluationInput {
  problem: ProblemSnapshot;
  submission: SubmissionSnapshot;
  rubric: RubricSnapshot;
}

interface CriterionResult {
  criterion: string;
  score?: number;
  observation: string;
  evidence: string[];
  concern?: string;
  suggestion?: string;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface EvaluationResult {
  evaluatorType: string;
  rubricVersion: string;
  summary: string;
  criteria: CriterionResult[];
}
```

## Prompt structure
Give the model:
1. Problem requirements
2. Candidate submission
3. Fixed rubric
4. Explicit instruction that multiple designs can be valid
5. Requirement to cite evidence from the submission
6. Requirement to distinguish evidence from inference
7. Required structured JSON output
8. Confidence field

## Hallucination control
The evaluator must not invent a class, method, requirement, or relationship that is absent from the submission.

If evidence is missing, say so.

Examples:
- Good: “No explicit pricing abstraction is present in the submitted classes.”
- Bad: “Your PricingStrategy implementation is incorrect” when no such implementation exists.

## Score handling
A criterion score is optional. If used, define its scale in the rubric.

The UI should not let a single number dominate the screen.

Prefer:
- strengths
- attention areas
- evidence
- actionable changes

## Feedback shape
Recommended hierarchy:

```text
CRITERION
OBSERVED
EVIDENCE
WHY IT MATTERS
CONCERN
SUGGESTED CHANGE
CONFIDENCE
```

## Composite evaluation
A practical flow:

```text
Submission
   |
   v
Deterministic Validator
   |
   +---- blocking issues? ---- yes --> return validation result
   |
   no
   v
AI Evaluator
   |
   v
Structured EvaluationResult
   |
   v
Persist Evaluation + Feedback
```

## Failure behavior
If AI fails:
- keep the submission
- mark evaluation FAILED
- record a safe reason/category
- allow retry
- do not silently claim completion

## Future evaluator extension
The application should allow a future:
- RuleBasedEvaluator
- HumanReviewerEvaluator
- AlternateAIEvaluator

without rewriting the attempt/submission flow.

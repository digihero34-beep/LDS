# CipherSchools PRD — Source Notes

This file is a concise source-grounded index of the uploaded PDF.

The original PDF is included alongside this file as `CipherSchools-Engineering-Assignment-PRD.pdf`.

## Core brief
The assignment is a “2-Day Engineering Assignment” to design and build a small LLD Practice Platform that helps a learner practice Low-Level Design, submit a solution, and receive useful, explainable feedback.

## Practice loop
Choose problem → Think / design → Submit → Get feedback → Review → Try again.

## MVP areas
Problem, Practice, Submission, Feedback, History, Core design.

## Main design questions
Meaningful attempt evidence; useful feedback with multiple valid designs; deterministic vs LLM evaluation; future evaluator/submission variation; slow/failing evaluation.

## Scope
Primarily LLD/domain design. Avoid spending the majority of time on Kubernetes, microservices, multi-region, sharding, CDN, and similar HLD concerns. Simple monolith is acceptable.

## AI usage
AI tools are encouraged. Include a short AI_USAGE.md describing 3–5 meaningful AI-assisted decisions, what was accepted/rejected, and why.

## Deliverables
Research note 1–2 pages; design note; working prototype; tests; README + AI_USAGE.md.

## Evaluation weights
Problem understanding/research 15%; product thinking/creativity 15%; LLD/domain design 25%; evaluation/feedback 15%; extensibility/engineering judgment 10%; implementation quality 10%; testing/reliability 5%; AI usage 5%.

## Candidate guide
The guide suggests researching a few existing approaches, selecting a narrow MVP, choosing the smallest submission format that provides enough evidence, using rubric dimensions rather than one canonical solution, separating deterministic checks from AI reasoning, and storing structured feedback such as criterion → score → evidence → concern → suggestion → confidence.

## Scale/failure guidance
Store the submission before evaluation starts. Use states such as Submitted → Evaluating → Completed / Failed. Avoid duplicate processing. Keep scaling practical.

## Important design warning
The guide explicitly says not to solve every possible problem, not to be impressed by many microservices with no need, not to add patterns merely to show pattern knowledge, and not to build an LLM prompt that simply asks for a 100-point score.

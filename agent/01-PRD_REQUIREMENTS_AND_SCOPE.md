# PRD REQUIREMENTS AND SCOPE

## Source-grounded assignment interpretation
The CipherSchools assignment asks for a focused MVP of an LLD practice platform. The stated practice loop is:

`Choose problem → Think / design → Submit → Get feedback → Review → Try again`

The MVP is expected to demonstrate:
- Problem selection with a small set of clear LLD problems
- A practice attempt with a chosen submission form (text, code, diagram, or combination are possible in the brief)
- Submission and status
- Useful feedback, with AI where reasoning is useful
- Previous attempt history
- Clear domain behavior represented by classes/interfaces and responsibilities

## Main product questions from the brief
The design should help answer:
1. What does a learner need to provide for an LLD attempt to be meaningful?
2. What makes feedback useful when multiple LLD solutions can be valid?
3. Which evaluation parts should be deterministic vs LLM-assisted?
4. How can another evaluation approach or submission format be added later?
5. What should happen when evaluation takes time or fails?

## Scope boundary
This is primarily an LLD/domain-design exercise.

Do NOT spend the majority of time on:
- Kubernetes
- microservices
- multi-region systems
- sharding
- CDN architecture
- elaborate HLD

A simple monolith is explicitly acceptable.

## Evaluation weights from the assignment
- Problem understanding & research: 15%
- Product thinking / creativity: 15%
- LLD / domain design: 25%
- Evaluation & feedback approach: 15%
- Extensibility & engineering judgment: 10%
- Implementation quality: 10%
- Testing & reliability: 5%
- AI usage: 5%

## Submission deliverables
- Research note: 1–2 pages
- Design note
- Working prototype
- Tests
- README
- AI_USAGE.md

## Research guidance from the brief
Research should be small and practical. Look at a few LLD practice/interview tools, GitHub projects, articles, or community discussions.

Look for:
- practice workflow
- submission style
- feedback style
- learning loop
- gaps worth simplifying or improving

## What the guide suggests for evaluation
Potential rubric dimensions:
- requirement understanding
- class responsibilities
- coupling/cohesion
- encapsulation/interfaces
- abstraction/pattern use
- extensibility
- edge cases/testability
- quality of explanation

## AI guidance from the brief
Good candidates for deterministic logic:
- required fields/structure
- compilation/tests if code is supported
- known business rules
- submission state transitions
- idempotency/duplicate handling

Good candidates for AI:
- quality of responsibilities
- design trade-offs
- SOLID/abstraction analysis
- candidate explanation analysis
- improvement suggestions

A fixed rubric + structured output is preferable to an unconstrained prompt.

## Explicit non-goals
Do not add large feature sets simply because they sound impressive.
Avoid:
- social feed
- community system
- leaderboards
- marketplace
- complicated LMS features
- many microservices
- an AI prompt whose sole output is a 100-point score

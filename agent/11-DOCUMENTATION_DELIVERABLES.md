# DOCUMENTATION DELIVERABLES

## README.md
Include:
1. What the product is
2. Problem being solved
3. MVP scope
4. Key product decisions
5. Architecture summary
6. Tech stack
7. Setup/install
8. Environment variables
9. Database setup/migrations/seed
10. How to run tests
11. How evaluation works
12. Known limitations
13. Future extensions

## Research note (1–2 pages)
Include:
- learner problem
- current ways learners practice LLD
- a few researched approaches/tools
- key gaps observed
- product direction chosen

Do not fabricate research. Cite actual sources used.

## Design note
Explain concisely:
- MVP definition
- user flow
- submission model and why it was chosen
- important classes/interfaces
- state machine
- evaluation approach
- deterministic vs AI split
- extensibility
- failure/retry handling
- key trade-offs

## AI_USAGE.md
The assignment asks for 3–5 meaningful AI-assisted decisions.

Use this structure:

```md
# AI Usage

## Decision 1 — ...
### What AI suggested
...
### What I accepted
...
### What I rejected
...
### Why
...
```

Be honest. Mention actual AI use, not hypothetical use.

Examples of meaningful categories:
- submission model
- evaluator output contract
- domain boundary proposal
- failure/retry strategy
- UI information architecture

## README wording rule
Clearly distinguish:
- “The assignment requires…”
from
- “We chose to…”

This is important because several implementation details in this instruction pack are proposed engineering decisions rather than explicit assignment requirements.

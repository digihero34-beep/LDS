# Ciphers School — Workspace Rules

These rules apply to **every task, file, response, and process** in this workspace.
You MUST read and internalize all referenced agent documents before taking any action.

---

## MANDATORY: Load All Agent Instructions

Before doing anything in this workspace, read and follow ALL files listed below in order.
They form a complete, authoritative specification for how this project must be built, designed, evaluated, and documented.

### Instruction Files (read in order)

1. `agent/00-MASTER_AGENT_INSTRUCTIONS.md`
   Role, primary objective, authority hierarchy, scope, quality bar, domain model, evaluator model, engineering constraints, UX constraints, deliverables, definition of done.

2. `agent/01-PRD_REQUIREMENTS_AND_SCOPE.md`
   Product requirements document, assignment scope, CipherSchools requirements (source of truth).

3. `agent/02-ARCHITECTURE.md`
   System architecture, monolith structure, layer boundaries, tech stack decisions.

4. `agent/03-DOMAIN_MODEL.md`
   Core domain entities: Problem, Attempt, Submission, Evaluation, Rubric, Feedback, Evaluator — their shapes, relationships, and invariants.

5. `agent/04-DATABASE_AND_DATA_STRUCTURES.md`
   Persistence strategy, data structures, storage schemas.

6. `agent/05-API_AND_APPLICATION_FLOW.md`
   API design, application flow, request/response contracts, state machine transitions.

7. `agent/06-EVALUATION_ENGINE.md`
   Evaluator abstraction, rule-based and AI evaluator implementations, feedback structure, reliability rules.

8. `agent/07-UI_DESIGN_SYSTEM.md`
   Design system: tokens, typography, color, spacing, component patterns. Engineering Design Review Workbench aesthetic. What to avoid.

9. `agent/08-STITCH_UI_PROMPT.md`
   Detailed UI screen-by-screen implementation prompts and layout specifications.

10. `agent/09-IMPLEMENTATION_PLAN_2_DAYS.md`
    Two-day delivery plan, milestones, phase breakdown, what ships at each checkpoint.

11. `agent/10-TESTING_AND_QA.md`
    Testing strategy, required test cases, QA criteria, smoke test procedure.

12. `agent/11-DOCUMENTATION_DELIVERABLES.md`
    Required documentation: README, AI_USAGE.md, research note, design note — format and content requirements.

13. `agent/12-AGENT_WORKING_RULES.md`
    Operational working rules: how to approach tasks, what to verify, how to communicate, what never to skip.

14. `agent/13-FINAL_REVIEW_CHECKLIST.md`
    Pre-completion checklist. Every item must pass before calling the project done.

15. `agent/SOURCE_ALIGNMENT.md`
    Source alignment guide — what is a PRD requirement vs. an implementation decision. Resolve conflicts by this document.

---

## Non-Negotiable Rules (summary — full detail is in the files above)

- **PRD wins.** When any implementation decision conflicts with `agent/01-PRD_REQUIREMENTS_AND_SCOPE.md`, the PRD takes precedence.
- **No scope creep.** Build the focused MVP. Do not add features not required by the PRD or master instructions.
- **Domain logic stays out of UI.** Keep business logic in service/domain layers, not in components.
- **Persist before evaluate.** Submission must be saved with status `SUBMITTED` before evaluation begins.
- **Explicit state transitions.** Use DRAFT → SUBMITTED → EVALUATING → COMPLETED / FAILED. Never skip states silently.
- **Never silently discard submissions or hide evaluation failures.**
- **Feedback must be evidence-based.** Every feedback item must expose: criterion, observation, evidence, concern, suggestion.
- **UI must follow the Engineering Design Review Workbench aesthetic** as defined in `agent/07-UI_DESIGN_SYSTEM.md`. No glassmorphism, no neon, no generic LMS look.
- **Run tests and the definition-of-done smoke test** before declaring anything complete.
- **Check `agent/13-FINAL_REVIEW_CHECKLIST.md` before every completion claim.**

---

## Authority Hierarchy

1. CipherSchools PRD (`agent/01-PRD_REQUIREMENTS_AND_SCOPE.md`) — source of truth for requirements
2. `agent/00-MASTER_AGENT_INSTRUCTIONS.md` — operationalizes the PRD
3. All other numbered agent files — implementation guidance
4. `agent/SOURCE_ALIGNMENT.md` — resolves conflicts between (2) and (3)

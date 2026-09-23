# UI DESIGN SYSTEM

## Product identity
Name concept: **LLD Practice** (or a small final brand name chosen by the builder).

Positioning:
**Engineering Design Review Workbench**

Core line:
**Practice like an engineer. Review like a mentor. Improve through evidence.**

This positioning is a proposed product direction, not a CipherSchools quote.

## Visual character
Blend:
- editorial information design
- modern developer tooling
- engineering notebook / blueprint details
- review-system clarity

The UI should feel built for software engineers.

## Avoid
- generic education dashboard patterns
- giant hero illustrations
- chatbot-first screens
- neon gradients
- cyberpunk
- glassmorphism
- endless pills
- excessive corner radius
- low-contrast gray-on-gray text
- score-as-hero feedback
- decorative AI sparkle motifs

## Layout philosophy
Use:
- large whitespace
- strong type scale
- asymmetric but measured composition
- hairline dividers
- dense technical metadata only where helpful
- focused panels
- sticky workspace controls

## Color token direction
Keep a neutral base and a restrained accent.

Recommended semantic token families:
- background
- surface
- surface-subtle
- text
- text-muted
- border
- accent
- accent-subtle
- success
- warning
- danger
- info

Do not let accent color dominate every component.

## Typography
Primary: modern sans-serif.
Secondary/technical: monospace.

Use monospace for:
- class names
- methods
- status metadata
- technical labels
- code-like snippets

Hierarchy:
- Display
- H1
- H2
- H3
- Body
- Small
- Caption
- Mono Small

## Spacing
Use a consistent 8px-based scale.

Example:
4, 8, 12, 16, 24, 32, 48, 64

## Radius
Use restrained medium-small radii. Surfaces should feel engineered rather than toy-like.

## Components
Build reusable components for:
- buttons
- icon buttons
- tabs
- filters
- status badges
- problem cards
- class design cards
- relationship rows
- structured inputs
- evidence blocks
- feedback panels
- timeline items
- progress/state indicators
- toast
- modal
- skeleton/loading
- empty state
- error/retry panel

## Screen priorities
### 1. Practice Workspace — highest priority
Three zones:
- left: problem/requirements
- center: structured design workspace
- right: deterministic design signals / inspector

### 2. Evaluation Feedback — highest differentiation
Never lead with a giant score.
Lead with what the learner did and what the evaluator observed.

### 3. Attempt Comparison — learning loop proof
Show evolution from one attempt to another.

## Practice workspace content
Sections:
- Requirements interpretation
- Assumptions
- Classes
- Relationships
- Design decisions
- Edge cases

Each class card should support:
- class/interface type
- name
- responsibility
- methods
- optional attributes/dependencies

## Feedback block pattern

```text
RESPONSIBILITY BOUNDARY

OBSERVED
ParkingLot handles fee calculation directly.

EVIDENCE
calculateFee()

WHY IT MATTERS
Pricing policy becomes coupled to parking orchestration.

SUGGESTED CHANGE
Introduce a pricing strategy boundary.

CONFIDENCE
HIGH
```

## Attempt history
Prefer an engineering timeline / revision history over a generic analytics table.

Example:
`Attempt 01 → Attempt 02 → Attempt 03`

Show:
- major improvement
- remaining concern
- state
- timestamp

## Submission states
Communicate clearly:
- Draft
- Submitted
- Evaluating
- Completed
- Failed / Retry available

## Failure screen
Use reassuring, factual microcopy:
- “Your design was saved.”
- “Evaluation could not be completed.”
- “You can retry without resubmitting.”

## Responsive behavior
Desktop is primary.

Tablet:
- collapse right inspector into a slide-over

Mobile:
- convert 3-column workspace into tabs: Problem / Design / Feedback

## Accessibility
- semantic labels
- keyboard navigation
- visible focus
- adequate contrast
- errors near fields
- do not rely on color alone
- respect reduced motion preferences

## Motion
Use subtle motion for:
- panel open/close
- state transitions
- feedback expansion
- save indicator

Never animate core information aggressively.

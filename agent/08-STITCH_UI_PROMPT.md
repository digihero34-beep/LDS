# GOOGLE STITCH — MASTER UI GENERATION PROMPT

Design a premium, original desktop-first web application called **LLD Practice**.

This is not a generic LMS, coding challenge site, or AI chatbot. It is an **Engineering Design Review Workbench** for practicing Low-Level Design.

CORE LOOP:
Choose problem → Think/design → Submit → Get feedback → Review → Try again.

CORE PRODUCT IDEA:
The learner is not merely trying to get a score. The learner needs to understand what their design expresses, what evidence supports the evaluation, what is weak or unclear, and how to improve the next attempt.

DESIGN PHILOSOPHY:
Editorial information design × developer IDE precision × engineering notebook/blueprint cues.

AVOID:
- generic SaaS dashboards
- generic LMS layouts
- cyberpunk/neon
- glassmorphism
- giant gradients
- cartoon education illustrations
- AI sparkle clichés
- over-rounded cards
- leaderboard-heavy gamification
- giant score as the primary feedback element

Use a refined neutral base, dark/high-contrast typography, restrained accent color, precise dividers, technical metadata, whitespace, measured asymmetry, and subtle depth.

TYPOGRAPHY:
Modern sans serif for UI.
Monospace for class names, methods, statuses, technical metadata, and code-like evidence.

CREATE A REUSABLE DESIGN SYSTEM:
Colors, type scale, spacing, radii, borders, shadows, icons, buttons, tabs, filters, badges, inputs, structured editors, feedback blocks, timeline items, loading/error states.

SCREENS:

1. PRACTICE HOME
Headline: “Continue your next design.”
Show a primary next problem, recent attempts, and practice momentum without making analytics the focus.

2. PROBLEM LIBRARY
Title: “Choose something to design.”
Problems:
- Parking Lot
- Elevator
- Vending Machine
- Notification Service
- Library Management
Show difficulty, estimated time, skills, short description, and last attempt state.

3. PROBLEM DETAIL
Show requirements, assumptions/constraints, expected design evidence, difficulty, estimated time, and Start Practice CTA.

4. PRACTICE WORKSPACE — MOST IMPORTANT
Use a 3-zone layout.

LEFT:
Problem specification:
- Requirements
- Constraints
- Assumptions to consider

CENTER:
Structured Design Sheet:
- Requirements understanding
- Assumptions
- Classes
- Relationships
- Design decisions
- Edge cases

Class editor cards must support:
Class / Interface / Abstract class
Name
Responsibility
Methods
Dependencies

RELATIONSHIP editor:
From → Relationship → To → Rationale

RIGHT:
Design Inspector with deterministic signals such as:
✓ Requirements captured
✓ Responsibilities defined
△ Relationship rationale incomplete
△ Edge-case coverage incomplete

Bottom actions:
Save Draft
Submit for Review

5. SUBMISSION REVIEW
Show a pre-flight summary:
Requirements captured
Classes defined
Relationships defined
Trade-offs explained
Edge cases captured

Also show blocking gaps before submission.

6. EVALUATION FEEDBACK — MOST DISTINCTIVE SCREEN
Header: “Design Review”
Problem + Attempt number + evaluation status.

Do not make an arbitrary 100-point score the hero.

Show design dimensions:
Requirement Understanding
Responsibilities
Coupling/Cohesion
Abstraction
Extensibility
Edge Cases

Each feedback item uses:
CRITERION
WHAT WE OBSERVED
EVIDENCE
WHY IT MATTERS
CONCERN
SUGGESTED CHANGE
CONFIDENCE

Example:

RESPONSIBILITY BOUNDARY
Observed: ParkingLot handles fee calculation directly.
Evidence: calculateFee()
Why it matters: Pricing policy is coupled to parking orchestration.
Suggested change: introduce a pricing strategy boundary.
Confidence: High

End with “Try again with these 3 changes”.

7. ATTEMPT HISTORY
Design as an engineering revision timeline.
Attempt 01 → Attempt 02 → Attempt 03
Show improvement + remaining concern.

8. ATTEMPT COMPARISON
Title: “See what changed.”
Compare two evaluation snapshots.
Highlight:
- added
- removed
- changed
- improved
- still problematic

Example:
Before: ParkingLot.calculateFee()
After: PricingStrategy.calculate()

9. EVALUATION FAILURE
Show:
“Your design was saved.”
“Evaluation could not be completed.”
State timeline:
Submitted ✓
Saved ✓
Evaluating ✕
Retry available

Action:
Retry Evaluation

RESPONSIVE:
Desktop first.
Tablet collapses inspector.
Mobile uses Problem / Design / Feedback tabs.

ACCESSIBILITY:
Keyboard navigation, semantic labels, visible focus, high contrast, color-independent statuses.

CONTENT TONE:
Professional, technical, calm, mentor-like, concise.

FINAL IMPRESSION:
The product should look purpose-built for software engineers practicing object-oriented design. A recruiter should immediately see the learner loop, the structured design workspace, evidence-based evaluation, and improvement history.

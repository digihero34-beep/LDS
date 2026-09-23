import { Rubric } from './Rubric';

export const DEFAULT_RUBRIC_VERSION = 'v1.0.0';

export const DEFAULT_RUBRIC = new Rubric(
  'rubric-lld-core-v1',
  DEFAULT_RUBRIC_VERSION,
  'Standard Low-Level Design Engineering Rubric',
  [
    {
      id: 'REQUIREMENT_UNDERSTANDING',
      name: 'Requirement Understanding',
      description: 'Addresses the stated problem scope, core operations, constraints, and non-functional goals without inventing off-spec requirements.',
      weight: 15,
      evaluatorGuidance: 'Check if essential requirements (functional flows, constraints) are addressed in the classes and assumptions.',
    },
    {
      id: 'RESPONSIBILITY_BOUNDARIES',
      name: 'Responsibility Boundaries',
      description: 'Single Responsibility Principle (SRP) application. Classes have clear, cohesive, non-overlapping domains of concern.',
      weight: 20,
      evaluatorGuidance: 'Verify that orchestration, state storage, pricing/calculations, and external coordination are assigned to distinct entities.',
    },
    {
      id: 'COUPLING_COHESION',
      name: 'Coupling & Cohesion',
      description: 'Low direct coupling between high-level policy and low-level detail; high internal cohesion within individual modules.',
      weight: 15,
      evaluatorGuidance: 'Identify unnecessary direct dependencies where abstraction or interfaces should be used.',
    },
    {
      id: 'ENCAPSULATION_INTERFACES',
      name: 'Encapsulation & Interfaces',
      description: 'Information hiding, well-defined method contracts, appropriate visibility modifiers, and programming to interfaces.',
      weight: 10,
      evaluatorGuidance: 'Ensure internal state is not exposed and interfaces decouple caller from implementation details.',
    },
    {
      id: 'ABSTRACTION_PATTERNS',
      name: 'Abstraction & Design Patterns',
      description: 'Appropriate application of design patterns (Strategy, Factory, State, Observer, etc.) where they simplify trade-offs without over-engineering.',
      weight: 10,
      evaluatorGuidance: 'Assess whether chosen design patterns solve concrete problems or introduce gratuitous complexity.',
    },
    {
      id: 'EXTENSIBILITY',
      name: 'Extensibility & Open-Closed',
      description: 'Ability to introduce new requirements, spot types, algorithms, or integrations with minimal modification to existing code.',
      weight: 15,
      evaluatorGuidance: 'Examine how easily new variants (e.g., EV spots, new pricing algorithms, extra vehicle types) can be plugged in.',
    },
    {
      id: 'EDGE_CASES',
      name: 'Edge Cases & Reliability',
      description: 'Identification of failure modes, boundary limits, concurrency contention, and recovery behavior.',
      weight: 10,
      evaluatorGuidance: 'Inspect edge cases for realistic production scenarios: capacity overflow, invalid inputs, payment failure, race conditions.',
    },
    {
      id: 'EXPLANATION_QUALITY',
      name: 'Explanation & Trade-off Quality',
      description: 'Quality of architectural reasoning, trade-off analysis, explicit alternatives considered, and relationship rationales.',
      weight: 5,
      evaluatorGuidance: 'Evaluate whether the candidate explains WHY decisions were made and what compromises were accepted.',
    },
  ]
);

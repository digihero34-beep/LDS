import { describe, expect, it } from 'vitest';
import { DEFAULT_RUBRIC } from '../../src/domain/rubric/defaultRubric';
import { SubmissionSnapshot } from '../../src/domain/submission/types';
import { CompositeEvaluator } from '../../src/infrastructure/evaluator/CompositeEvaluator';
import { HeuristicEvaluator } from '../../src/infrastructure/evaluator/HeuristicEvaluator';

describe('Evaluation Engine: Heuristic & Composite Evaluators', () => {
  const heuristicEvaluator = new HeuristicEvaluator();
  const compositeEvaluator = new CompositeEvaluator();

  const sampleProblem = {
    id: 'prob-parking-lot',
    slug: 'parking-lot',
    title: 'Design a Parking Lot',
    difficulty: 'MEDIUM' as const,
    estimatedMinutes: 35,
    summary: 'Design parking lot',
    requirements: [],
    constraints: [],
    skills: [],
    evaluationHints: [],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('evaluates coupled fee calculation and generates actionable feedback with evidence', async () => {
    const submission: SubmissionSnapshot = {
      id: 'sub-coupled',
      attemptId: 'att-1',
      version: 1,
      requirementsUnderstanding: 'Design of a parking lot system.',
      assumptions: ['Standard rates'],
      classes: [
        {
          id: 'cls-1',
          name: 'ParkingLot',
          type: 'CLASS',
          responsibility: 'Controls lot and calculates customer fees directly.',
          methods: [
            { name: 'parkVehicle', returnType: 'Ticket', parameters: ['Vehicle'] },
            { name: 'calculateFee', returnType: 'double', parameters: ['Ticket'] },
          ],
          dependencies: ['ParkingSpot'],
        },
        {
          id: 'cls-2',
          name: 'ParkingSpot',
          type: 'CLASS',
          responsibility: 'Manages occupied state.',
          methods: [],
          dependencies: [],
        },
      ],
      relationships: [
        {
          id: 'rel-1',
          fromClass: 'ParkingLot',
          toClass: 'ParkingSpot',
          type: 'CONTAINS',
          rationale: 'Lot holds spots.',
        },
      ],
      designDecisions: [],
      edgeCases: [{ id: 'edge-1', scenario: 'Full lot', expectedBehavior: 'Deny entry' }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await heuristicEvaluator.evaluate({
      problem: sampleProblem,
      submission,
      rubric: DEFAULT_RUBRIC.toSnapshot(),
    });

    expect(result.criteria).toHaveLength(8);
    const respCriterion = result.criteria.find((c) => c.criterion === 'Responsibility Boundaries');
    expect(respCriterion).toBeDefined();
    expect(respCriterion?.rating).toBe('NEEDS_ATTENTION');
    expect(respCriterion?.evidence).toContain('ParkingLot.calculateFee()');
    expect(respCriterion?.suggestion).toContain('PricingStrategy');
    expect(result.priorityImprovements.some((p) => p.includes('PricingStrategy'))).toBe(true);
  });

  it('rewards decoupled strategy pattern design with STRONG ratings', async () => {
    const submission: SubmissionSnapshot = {
      id: 'sub-decoupled',
      attemptId: 'att-2',
      version: 1,
      requirementsUnderstanding: 'Comprehensive parking lot with strategy pattern pricing and level hierarchy.',
      assumptions: ['Dynamic pricing applied'],
      classes: [
        {
          id: 'cls-1',
          name: 'ParkingLot',
          type: 'CLASS',
          responsibility: 'Coordinates parking floors and delegates billing to strategy.',
          methods: [{ name: 'park', returnType: 'Ticket', parameters: ['Vehicle'] }],
          dependencies: ['PricingStrategy', 'Level'],
        },
        {
          id: 'cls-2',
          name: 'PricingStrategy',
          type: 'INTERFACE',
          responsibility: 'Contract for calculating parking fees.',
          methods: [{ name: 'calculateFee', returnType: 'double', parameters: ['long'] }],
          dependencies: [],
        },
        {
          id: 'cls-3',
          name: 'HourlyPricingStrategy',
          type: 'CLASS',
          responsibility: 'Tiered hourly fee calculation.',
          methods: [{ name: 'calculateFee', returnType: 'double', parameters: ['long'] }],
          dependencies: [],
        },
        {
          id: 'cls-4',
          name: 'Level',
          type: 'CLASS',
          responsibility: 'Manages floor spots.',
          methods: [],
          dependencies: [],
        },
      ],
      relationships: [
        {
          id: 'rel-1',
          fromClass: 'HourlyPricingStrategy',
          toClass: 'PricingStrategy',
          type: 'IMPLEMENTS',
          rationale: 'Concrete strategy.',
        },
        {
          id: 'rel-2',
          fromClass: 'ParkingLot',
          toClass: 'PricingStrategy',
          type: 'USES',
          rationale: 'Delegates billing calculation.',
        },
        {
          id: 'rel-3',
          fromClass: 'ParkingLot',
          toClass: 'Level',
          type: 'CONTAINS',
          rationale: 'Floor management.',
        },
      ],
      designDecisions: [
        {
          id: 'dec-1',
          title: 'Strategy Pattern for Pricing',
          decision: 'Extracted fee calculation to PricingStrategy interface.',
          rationale: 'Enables dynamic pricing without altering ParkingLot.',
        },
      ],
      edgeCases: [
        { id: 'edge-1', scenario: 'Lot full', expectedBehavior: 'Return full message' },
        { id: 'edge-2', scenario: 'Concurrent slot allocation race', expectedBehavior: 'CAS lock on slot' },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await compositeEvaluator.evaluate({
      problem: sampleProblem,
      submission,
      rubric: DEFAULT_RUBRIC.toSnapshot(),
    });

    const respCriterion = result.criteria.find((c) => c.criterion === 'Responsibility Boundaries');
    expect(respCriterion?.rating).toBe('STRONG');
    expect(result.strengths.length).toBeGreaterThanOrEqual(2);
  });
});

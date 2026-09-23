import { describe, expect, it } from 'vitest';
import { DeterministicEvaluator } from '../../src/infrastructure/evaluator/DeterministicEvaluator';
import { SubmissionSnapshot } from '../../src/domain/submission/types';

describe('DeterministicEvaluator', () => {
  const evaluator = new DeterministicEvaluator();

  it('blocks submission when requirements understanding is missing', () => {
    const submission: SubmissionSnapshot = {
      id: 'sub-1',
      attemptId: 'att-1',
      version: 1,
      requirementsUnderstanding: '',
      assumptions: [],
      classes: [
        {
          id: 'cls-1',
          name: 'ParkingLot',
          type: 'CLASS',
          responsibility: 'Coordinator',
          methods: [],
          dependencies: [],
        },
      ],
      relationships: [],
      designDecisions: [],
      edgeCases: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = evaluator.inspect(submission);
    expect(res.isValid).toBe(false);
    expect(res.blockingErrors).toContain('Requirements understanding section is required.');
  });

  it('blocks submission when class has empty responsibility', () => {
    const submission: SubmissionSnapshot = {
      id: 'sub-2',
      attemptId: 'att-1',
      version: 1,
      requirementsUnderstanding: 'Sufficient requirements text explaining system scope.',
      assumptions: [],
      classes: [
        {
          id: 'cls-1',
          name: 'ParkingLot',
          type: 'CLASS',
          responsibility: '',
          methods: [],
          dependencies: [],
        },
      ],
      relationships: [],
      designDecisions: [],
      edgeCases: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = evaluator.inspect(submission);
    expect(res.isValid).toBe(false);
    expect(res.blockingErrors).toContain('Every defined class must have a clearly stated responsibility.');
  });

  it('blocks submission when relationship points to unknown class', () => {
    const submission: SubmissionSnapshot = {
      id: 'sub-3',
      attemptId: 'att-1',
      version: 1,
      requirementsUnderstanding: 'Sufficient requirements text explaining system scope.',
      assumptions: [],
      classes: [
        {
          id: 'cls-1',
          name: 'ParkingLot',
          type: 'CLASS',
          responsibility: 'Main controller',
          methods: [],
          dependencies: [],
        },
      ],
      relationships: [
        {
          id: 'rel-1',
          fromClass: 'ParkingLot',
          toClass: 'GhostClass',
          type: 'USES',
          rationale: 'Invalid link',
        },
      ],
      designDecisions: [],
      edgeCases: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = evaluator.inspect(submission);
    expect(res.isValid).toBe(false);
    expect(res.blockingErrors).toContain(
      'All relationships must point to valid, defined classes in the design sheet.'
    );
  });

  it('passes valid submission and returns readiness score and signals', () => {
    const submission: SubmissionSnapshot = {
      id: 'sub-4',
      attemptId: 'att-1',
      version: 1,
      requirementsUnderstanding:
        'Detailed requirements understanding explaining parking, floor navigation, tickets, and payments.',
      assumptions: ['Level 1 dedicated to compact spots.'],
      classes: [
        {
          id: 'cls-1',
          name: 'ParkingLot',
          type: 'CLASS',
          responsibility: 'Coordinates entry and level routing.',
          methods: [{ name: 'park', returnType: 'Ticket', parameters: ['Vehicle'] }],
          dependencies: ['Level'],
        },
        {
          id: 'cls-2',
          name: 'Level',
          type: 'CLASS',
          responsibility: 'Maintains spots on a single floor.',
          methods: [],
          dependencies: [],
        },
      ],
      relationships: [
        {
          id: 'rel-1',
          fromClass: 'ParkingLot',
          toClass: 'Level',
          type: 'CONTAINS',
          rationale: 'ParkingLot manages multiple floors.',
        },
      ],
      designDecisions: [
        {
          id: 'dec-1',
          title: 'Decoupled Floor Hierarchy',
          decision: 'Created Level class',
          rationale: 'Enables independent capacity tracking.',
        },
      ],
      edgeCases: [
        {
          id: 'edge-1',
          scenario: 'Lot full',
          expectedBehavior: 'Reject entry and turn on FULL indicator.',
        },
        {
          id: 'edge-2',
          scenario: 'Concurrent spot allocation',
          expectedBehavior: 'Atomic compare-and-set locking on spot state.',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = evaluator.inspect(submission);
    expect(res.isValid).toBe(true);
    expect(res.blockingErrors).toHaveLength(0);
    expect(res.readinessScore).toBeGreaterThanOrEqual(4);
    expect(res.signals.length).toBeGreaterThanOrEqual(5);
  });
});

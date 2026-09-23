import { describe, expect, it } from 'vitest';
import {
  attemptRepository,
  compareAttemptsUseCase,
  createAttemptUseCase,
  evaluateAttemptUseCase,
  getAttemptHistoryUseCase,
  getProblemByIdUseCase,
  getProblemsUseCase,
  problemRepository,
  retryEvaluationUseCase,
  saveDraftUseCase,
  submissionRepository,
  submitAttemptUseCase,
} from '../../src/infrastructure/services';
import { Evaluator } from '../../src/domain/evaluator/Evaluator';
import { EvaluateAttemptUseCase } from '../../src/application/evaluation/evaluateAttempt';
import { RetryEvaluationUseCase } from '../../src/application/evaluation/retryEvaluation';
import { evaluationRepository } from '../../src/infrastructure/services';

describe('Application End-to-End Practice Loop', () => {
  it('executes the full practice journey: choose -> start -> draft -> submit -> evaluate -> history -> compare', async () => {
    // 1. Choose problem
    const problems = await getProblemsUseCase.execute();
    expect(problems.length).toBeGreaterThanOrEqual(1);

    const problem = await getProblemByIdUseCase.execute('parking-lot');
    expect(problem).not.toBeNull();
    const problemId = problem!.id;

    // 2. Start attempt
    const created = await createAttemptUseCase.execute(problemId);
    expect(created.attempt.status).toBe('DRAFT');
    expect(created.attempt.attemptNumber).toBeGreaterThan(0);
    const attemptId = created.attempt.id;

    // 3. Save draft
    const draftPayload = {
      requirementsUnderstanding: 'Designing a modular parking lot with decoupled fee calculations and floor allocations.',
      assumptions: ['Level 1 dedicated to compact vehicles.'],
      classes: [
        {
          id: 'cls-1',
          name: 'ParkingLot',
          type: 'CLASS' as const,
          responsibility: 'Coordinates overall parking operations and delegates fee calculation.',
          methods: [{ name: 'park', returnType: 'Ticket', parameters: ['Vehicle'] }],
          dependencies: ['Level', 'PricingStrategy'],
        },
        {
          id: 'cls-2',
          name: 'PricingStrategy',
          type: 'INTERFACE' as const,
          responsibility: 'Defines pricing calculation contract.',
          methods: [{ name: 'calculateFee', returnType: 'double', parameters: ['long'] }],
          dependencies: [],
        },
        {
          id: 'cls-3',
          name: 'Level',
          type: 'CLASS' as const,
          responsibility: 'Maintains parking spots on a floor.',
          methods: [],
          dependencies: [],
        },
      ],
      relationships: [
        {
          id: 'rel-1',
          fromClass: 'ParkingLot',
          toClass: 'Level',
          type: 'CONTAINS' as const,
          rationale: 'Lot contains multiple levels.',
        },
        {
          id: 'rel-2',
          fromClass: 'ParkingLot',
          toClass: 'PricingStrategy',
          type: 'USES' as const,
          rationale: 'Delegates fee calculation.',
        },
      ],
      designDecisions: [
        {
          id: 'dec-1',
          title: 'Strategy Pattern for Pricing',
          decision: 'Extracted fee calculation to PricingStrategy interface.',
          rationale: 'Decoupled billing logic from floor routing.',
        },
      ],
      edgeCases: [
        {
          id: 'edge-1',
          scenario: 'Lot full',
          expectedBehavior: 'Deny entry and turn on FULL indicator.',
        },
        {
          id: 'edge-2',
          scenario: 'Concurrent spot allocation',
          expectedBehavior: 'Atomic compare-and-set locking on spot state.',
        },
      ],
    };

    const savedDraft = await saveDraftUseCase.execute(attemptId, draftPayload);
    expect(savedDraft.classes).toHaveLength(3);

    // 4. Submit attempt
    const submitResult = await submitAttemptUseCase.execute(attemptId, draftPayload);
    expect(submitResult.attempt.status).toBe('COMPLETED');
    expect(submitResult.evaluation).toBeDefined();
    expect(submitResult.evaluation?.status).toBe('COMPLETED');
    expect(submitResult.evaluation?.criteria.length).toBe(8);

    // 5. Verify attempt history
    const history = await getAttemptHistoryUseCase.execute(problemId);
    expect(history.length).toBeGreaterThanOrEqual(1);
    const thisAttempt = history.find((h) => h.attempt.id === attemptId);
    expect(thisAttempt).toBeDefined();
    expect(thisAttempt?.attempt.status).toBe('COMPLETED');

    // 6. Compare attempts (e.g. Attempt #01 vs newly submitted attempt)
    const seededAttempt1 = history.find((h) => h.attempt.attemptNumber === 1);
    if (seededAttempt1) {
      const comparison = await compareAttemptsUseCase.execute(seededAttempt1.attempt.id, attemptId);
      expect(comparison.classesDiff.length).toBeGreaterThan(0);
      expect(comparison.criteriaDiff.length).toBeGreaterThan(0);
      expect(comparison.nextChallenge).toBeDefined();
    }
  });

  it('rejects saving drafts to completed attempts', async () => {
    const problem = await getProblemByIdUseCase.execute('parking-lot');
    const created = await createAttemptUseCase.execute(problem!.id);

    const validPayload = {
      requirementsUnderstanding: 'Complete valid requirements understanding description text.',
      assumptions: [],
      classes: [
        {
          id: 'cls-1',
          name: 'Gate',
          type: 'CLASS' as const,
          responsibility: 'Entry barrier',
          methods: [],
          dependencies: [],
        },
      ],
      relationships: [],
      designDecisions: [],
      edgeCases: [{ id: 'e1', scenario: 'Gate power loss', expectedBehavior: 'Manual release' }],
    };

    await submitAttemptUseCase.execute(created.attempt.id, validPayload);

    await expect(saveDraftUseCase.execute(created.attempt.id, validPayload)).rejects.toThrow(
      /Cannot edit draft for attempt in 'COMPLETED' status/
    );
  });

  it('preserves submission on evaluation failure and allows successful retry', async () => {
    const problem = await getProblemByIdUseCase.execute('parking-lot');
    const created = await createAttemptUseCase.execute(problem!.id);

    const validPayload = {
      requirementsUnderstanding: 'Requirements understanding for failure recovery testing.',
      assumptions: ['Testing transient provider outage'],
      classes: [
        {
          id: 'cls-1',
          name: 'Sensor',
          type: 'CLASS' as const,
          responsibility: 'Detects vehicle presence',
          methods: [],
          dependencies: [],
        },
      ],
      relationships: [],
      designDecisions: [],
      edgeCases: [{ id: 'e1', scenario: 'Sensor glitch', expectedBehavior: 'Log diagnostic' }],
    };

    // Save draft first
    await saveDraftUseCase.execute(created.attempt.id, validPayload);

    // Mock a failing evaluator
    let shouldFail = true;
    const mockEvaluator: Evaluator = {
      name: 'MOCK_FAILING_EVALUATOR',
      evaluate: async () => {
        if (shouldFail) {
          throw new Error('Simulated upstream AI gateway timeout');
        }
        return {
          evaluatorType: 'MOCK_FAILING_EVALUATOR',
          rubricVersion: 'v1.0.0',
          summary: 'Recovered successfully after retry.',
          strengths: ['Resilience demonstrated'],
          priorityImprovements: [],
          criteria: [],
        };
      },
    };

    const failingEvaluateUseCase = new EvaluateAttemptUseCase(
      problemRepository,
      attemptRepository,
      submissionRepository,
      evaluationRepository,
      mockEvaluator
    );

    const failingRetryUseCase = new RetryEvaluationUseCase(
      attemptRepository,
      failingEvaluateUseCase
    );

    // Submit attempt with failing evaluator
    const attempt = await attemptRepository.findById(created.attempt.id);
    attempt!.transitionToSubmitted();
    await attemptRepository.save(attempt!);

    const failedEval = await failingEvaluateUseCase.execute(created.attempt.id);
    expect(failedEval.status).toBe('FAILED');
    expect(failedEval.failureReason).toContain('Simulated upstream AI gateway timeout');

    // Verify submission is STILL completely intact in the database!
    const persistedSub = await submissionRepository.findByAttemptId(created.attempt.id);
    expect(persistedSub).not.toBeNull();
    expect(persistedSub?.classes).toHaveLength(1);
    expect(persistedSub?.classes[0].name).toBe('Sensor');

    // Verify attempt is in FAILED status
    const failedAttempt = await attemptRepository.findById(created.attempt.id);
    expect(failedAttempt?.status).toBe('FAILED');

    // Now simulate recovery: upstream service is back online!
    shouldFail = false;
    const recoveredEval = await failingRetryUseCase.execute(created.attempt.id);
    expect(recoveredEval.status).toBe('COMPLETED');
    expect(recoveredEval.summary).toBe('Recovered successfully after retry.');

    // Verify attempt transitioned to COMPLETED
    const completedAttempt = await attemptRepository.findById(created.attempt.id);
    expect(completedAttempt?.status).toBe('COMPLETED');
  });
});

import { describe, expect, it } from 'vitest';
import { Attempt } from '../../src/domain/attempt/Attempt';
import { IllegalStateTransitionError } from '../../src/domain/attempt/errors';

describe('Attempt Domain State Machine', () => {
  it('initializes in DRAFT status with monotonic attempt number', () => {
    const attempt = new Attempt('att-1', 'prob-1', 1);
    expect(attempt.status).toBe('DRAFT');
    expect(attempt.attemptNumber).toBe(1);
    expect(attempt.submittedAt).toBeNull();
    expect(attempt.completedAt).toBeNull();
  });

  it('allows valid legal progression: DRAFT -> SUBMITTED -> EVALUATING -> COMPLETED', () => {
    const attempt = new Attempt('att-1', 'prob-1', 1);

    attempt.transitionToSubmitted();
    expect(attempt.status).toBe('SUBMITTED');
    expect(attempt.submittedAt).toBeInstanceOf(Date);

    attempt.transitionToEvaluating();
    expect(attempt.status).toBe('EVALUATING');

    attempt.transitionToCompleted();
    expect(attempt.status).toBe('COMPLETED');
    expect(attempt.completedAt).toBeInstanceOf(Date);
  });

  it('rejects illegal transition from DRAFT directly to COMPLETED', () => {
    const attempt = new Attempt('att-1', 'prob-1', 1);
    expect(() => attempt.transitionToCompleted()).toThrow(IllegalStateTransitionError);
    expect(attempt.status).toBe('DRAFT');
  });

  it('rejects illegal transition from DRAFT directly to EVALUATING', () => {
    const attempt = new Attempt('att-1', 'prob-1', 1);
    expect(() => attempt.transitionToEvaluating()).toThrow(IllegalStateTransitionError);
  });

  it('handles evaluation failure and allows retry from FAILED back to EVALUATING', () => {
    const attempt = new Attempt('att-1', 'prob-1', 1);
    attempt.transitionToSubmitted();
    attempt.transitionToEvaluating();

    attempt.transitionToFailed();
    expect(attempt.status).toBe('FAILED');

    // Cannot transition FAILED directly to COMPLETED
    expect(() => attempt.transitionToCompleted()).toThrow(IllegalStateTransitionError);

    // Can retry from FAILED to EVALUATING
    attempt.retry();
    expect(attempt.status).toBe('EVALUATING');

    // Then can successfully complete
    attempt.transitionToCompleted();
    expect(attempt.status).toBe('COMPLETED');
  });

  it('rejects evaluation retry if attempt is already COMPLETED', () => {
    const attempt = new Attempt('att-1', 'prob-1', 1);
    attempt.transitionToSubmitted();
    attempt.transitionToEvaluating();
    attempt.transitionToCompleted();

    expect(() => attempt.retry()).toThrow(IllegalStateTransitionError);
    expect(() => attempt.transitionToEvaluating()).toThrow(IllegalStateTransitionError);
  });
});

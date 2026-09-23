import { AttemptSnapshot } from '@/domain/attempt/Attempt';
import { EvaluationSnapshot } from '@/domain/evaluation/types';
import { IAttemptRepository, ISubmissionRepository } from '@/domain/repositories';
import { Submission } from '@/domain/submission/Submission';
import { SubmissionPayload, SubmissionSnapshot } from '@/domain/submission/types';
import { DeterministicEvaluator } from '@/infrastructure/evaluator/DeterministicEvaluator';
import { EvaluateAttemptUseCase } from '../evaluation/evaluateAttempt';

export interface SubmitAttemptResult {
  attempt: AttemptSnapshot;
  submission: SubmissionSnapshot;
  evaluation?: EvaluationSnapshot;
}

export class SubmitAttemptUseCase {
  private readonly deterministicEvaluator = new DeterministicEvaluator();

  constructor(
    private readonly attemptRepo: IAttemptRepository,
    private readonly submissionRepo: ISubmissionRepository,
    private readonly evaluateAttemptUseCase: EvaluateAttemptUseCase
  ) {}

  async execute(attemptId: string, payload: SubmissionPayload): Promise<SubmitAttemptResult> {
    const attempt = await this.attemptRepo.findById(attemptId);
    if (!attempt) {
      throw new Error(`Attempt with ID '${attemptId}' not found.`);
    }

    // Idempotency: If attempt is already SUBMITTED, EVALUATING, or COMPLETED, do not re-submit
    if (attempt.status !== 'DRAFT') {
      const existingSubmission = await this.submissionRepo.findByAttemptId(attemptId);
      return {
        attempt: attempt.toSnapshot(),
        submission: existingSubmission ? existingSubmission.toSnapshot() : ({} as SubmissionSnapshot),
      };
    }

    // 1. Build Submission entity and validate invariants
    let submission = await this.submissionRepo.findByAttemptId(attemptId);
    const submissionId = submission ? submission.id : `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const version = (submission?.version ?? 0) + 1;

    submission = new Submission(
      submissionId,
      attemptId,
      version,
      payload.requirementsUnderstanding,
      payload.assumptions,
      payload.classes,
      payload.relationships,
      payload.designDecisions,
      payload.edgeCases
    );

    // 2. Deterministic pre-checks
    const inspection = this.deterministicEvaluator.inspect(submission.toSnapshot());
    if (!inspection.isValid) {
      throw new Error(`Submission blocked: ${inspection.blockingErrors.join(' ')}`);
    }

    // 3. Persist submission BEFORE evaluation begins (Rule: persist before evaluate)
    await this.submissionRepo.save(submission);

    // 4. Transition attempt state: DRAFT -> SUBMITTED
    attempt.transitionToSubmitted();
    await this.attemptRepo.save(attempt);

    // 5. Trigger evaluation
    const evaluation = await this.evaluateAttemptUseCase.execute(attemptId);

    // Re-fetch final attempt state
    const updatedAttempt = await this.attemptRepo.findById(attemptId);

    return {
      attempt: updatedAttempt ? updatedAttempt.toSnapshot() : attempt.toSnapshot(),
      submission: submission.toSnapshot(),
      evaluation,
    };
  }
}

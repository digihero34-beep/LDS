import { EvaluationSnapshot } from '@/domain/evaluation/types';
import { IAttemptRepository } from '@/domain/repositories';
import { EvaluateAttemptUseCase } from './evaluateAttempt';

export class RetryEvaluationUseCase {
  constructor(
    private readonly attemptRepo: IAttemptRepository,
    private readonly evaluateAttemptUseCase: EvaluateAttemptUseCase
  ) {}

  async execute(attemptId: string): Promise<EvaluationSnapshot> {
    const attempt = await this.attemptRepo.findById(attemptId);
    if (!attempt) {
      throw new Error(`Attempt with ID '${attemptId}' not found.`);
    }

    if (attempt.status !== 'FAILED') {
      throw new Error(`Cannot retry evaluation: attempt is in '${attempt.status}' status (must be FAILED).`);
    }

    // Explicit state transition
    attempt.retry();
    await this.attemptRepo.save(attempt);

    return await this.evaluateAttemptUseCase.execute(attemptId);
  }
}

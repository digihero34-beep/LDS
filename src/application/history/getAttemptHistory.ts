import { AttemptSnapshot } from '@/domain/attempt/Attempt';
import { EvaluationSnapshot } from '@/domain/evaluation/types';
import { IAttemptRepository, IEvaluationRepository, ISubmissionRepository } from '@/domain/repositories';
import { SubmissionSnapshot } from '@/domain/submission/types';

export interface AttemptHistoryItem {
  attempt: AttemptSnapshot;
  submission: SubmissionSnapshot | null;
  evaluation: EvaluationSnapshot | null;
  majorImprovement?: string;
  remainingConcern?: string;
}

export class GetAttemptHistoryUseCase {
  constructor(
    private readonly attemptRepo: IAttemptRepository,
    private readonly submissionRepo: ISubmissionRepository,
    private readonly evaluationRepo: IEvaluationRepository
  ) {}

  async execute(problemId: string): Promise<AttemptHistoryItem[]> {
    const attempts = await this.attemptRepo.findByProblemId(problemId);
    const history: AttemptHistoryItem[] = [];

    for (const attempt of attempts) {
      const submission = await this.submissionRepo.findByAttemptId(attempt.id);
      const evaluation = await this.evaluationRepo.findByAttemptId(attempt.id);

      const majorImprovement = evaluation?.strengths?.[0] || undefined;
      const remainingConcern =
        evaluation?.priorityImprovements?.[0] ||
        evaluation?.criteria.find((c) => c.rating === 'NEEDS_ATTENTION' || c.rating === 'INCOMPLETE')?.concern ||
        undefined;

      history.push({
        attempt: attempt.toSnapshot(),
        submission: submission ? submission.toSnapshot() : null,
        evaluation: evaluation ? evaluation.toSnapshot() : null,
        majorImprovement,
        remainingConcern,
      });
    }

    return history;
  }
}

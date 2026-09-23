import { Attempt, AttemptSnapshot } from '@/domain/attempt/Attempt';
import { IAttemptRepository, IProblemRepository, ISubmissionRepository } from '@/domain/repositories';
import { Submission } from '@/domain/submission/Submission';
import { SubmissionSnapshot } from '@/domain/submission/types';

export interface CreateAttemptResult {
  attempt: AttemptSnapshot;
  submission: SubmissionSnapshot;
}

export class CreateAttemptUseCase {
  constructor(
    private readonly problemRepo: IProblemRepository,
    private readonly attemptRepo: IAttemptRepository,
    private readonly submissionRepo: ISubmissionRepository
  ) {}

  async execute(problemId: string): Promise<CreateAttemptResult> {
    const problem = await this.problemRepo.findById(problemId);
    if (!problem) {
      throw new Error(`Problem with ID '${problemId}' not found.`);
    }

    const attemptNumber = await this.attemptRepo.getNextAttemptNumber(problemId);
    const attemptId = `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const submissionId = `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const attempt = new Attempt(attemptId, problemId, attemptNumber, 'DRAFT');
    const submission = new Submission(
      submissionId,
      attemptId,
      1,
      '',
      [],
      [],
      [],
      [],
      []
    );

    await this.attemptRepo.save(attempt);
    await this.submissionRepo.save(submission);

    return {
      attempt: attempt.toSnapshot(),
      submission: submission.toSnapshot(),
    };
  }
}

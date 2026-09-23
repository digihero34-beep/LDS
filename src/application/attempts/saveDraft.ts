import { IAttemptRepository, ISubmissionRepository } from '@/domain/repositories';
import { Submission } from '@/domain/submission/Submission';
import { SubmissionPayload, SubmissionSnapshot } from '@/domain/submission/types';

export class SaveDraftUseCase {
  constructor(
    private readonly attemptRepo: IAttemptRepository,
    private readonly submissionRepo: ISubmissionRepository
  ) {}

  async execute(attemptId: string, payload: SubmissionPayload): Promise<SubmissionSnapshot> {
    const attempt = await this.attemptRepo.findById(attemptId);
    if (!attempt) {
      throw new Error(`Attempt with ID '${attemptId}' not found.`);
    }

    if (attempt.status !== 'DRAFT') {
      throw new Error(`Cannot edit draft for attempt in '${attempt.status}' status. Submission is immutable.`);
    }

    let submission = await this.submissionRepo.findByAttemptId(attemptId);
    const version = submission ? submission.version : 1;
    const submissionId = submission ? submission.id : `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    submission = new Submission(
      submissionId,
      attemptId,
      version,
      payload.requirementsUnderstanding ?? '',
      payload.assumptions ?? [],
      payload.classes ?? [],
      payload.relationships ?? [],
      payload.designDecisions ?? [],
      payload.edgeCases ?? [],
      submission ? submission.createdAt : new Date(),
      new Date()
    );

    await this.submissionRepo.save(submission);
    return submission.toSnapshot();
  }
}

import { Evaluation, EvaluationSnapshot } from '@/domain/evaluation/Evaluation';
import { Evaluator } from '@/domain/evaluator/Evaluator';
import { IAttemptRepository, IEvaluationRepository, IProblemRepository, ISubmissionRepository } from '@/domain/repositories';
import { DEFAULT_RUBRIC } from '@/domain/rubric/defaultRubric';

export class EvaluateAttemptUseCase {
  constructor(
    private readonly problemRepo: IProblemRepository,
    private readonly attemptRepo: IAttemptRepository,
    private readonly submissionRepo: ISubmissionRepository,
    private readonly evaluationRepo: IEvaluationRepository,
    private readonly evaluator: Evaluator
  ) {}

  async execute(attemptId: string): Promise<EvaluationSnapshot> {
    const attempt = await this.attemptRepo.findById(attemptId);
    if (!attempt) {
      throw new Error(`Attempt with ID '${attemptId}' not found.`);
    }

    if (attempt.status !== 'SUBMITTED' && attempt.status !== 'FAILED' && attempt.status !== 'EVALUATING') {
      throw new Error(`Cannot evaluate attempt in '${attempt.status}' status.`);
    }

    const problem = await this.problemRepo.findById(attempt.problemId);
    if (!problem) {
      throw new Error(`Problem with ID '${attempt.problemId}' not found.`);
    }

    const submission = await this.submissionRepo.findByAttemptId(attemptId);
    if (!submission) {
      throw new Error(`Submission for attempt '${attemptId}' not found.`);
    }

    // Explicit state transition to EVALUATING
    if (attempt.status !== 'EVALUATING') {
      attempt.transitionToEvaluating();
      await this.attemptRepo.save(attempt);
    }

    // Create or retrieve evaluation record
    const evaluationId = `eval-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const evaluation = new Evaluation(
      evaluationId,
      attempt.id,
      submission.id,
      this.evaluator.name,
      DEFAULT_RUBRIC.version,
      'EVALUATING'
    );
    await this.evaluationRepo.save(evaluation);

    try {
      const result = await this.evaluator.evaluate({
        problem: problem.toSnapshot(),
        submission: submission.toSnapshot(),
        rubric: DEFAULT_RUBRIC.toSnapshot(),
      });

      // Complete evaluation and attempt
      evaluation.complete(result);
      await this.evaluationRepo.save(evaluation);

      attempt.transitionToCompleted();
      await this.attemptRepo.save(attempt);

      return evaluation.toSnapshot();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Evaluation engine encountered an error';
      console.error(`Evaluation failed for attempt '${attemptId}':`, errorMessage);

      // Persist failure safely without corrupting or deleting submission
      evaluation.fail(errorMessage);
      await this.evaluationRepo.save(evaluation);

      attempt.transitionToFailed();
      await this.attemptRepo.save(attempt);

      return evaluation.toSnapshot();
    }
  }
}

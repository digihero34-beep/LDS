import { CreateAttemptUseCase } from '@/application/attempts/createAttempt';
import { SaveDraftUseCase } from '@/application/attempts/saveDraft';
import { SubmitAttemptUseCase } from '@/application/attempts/submitAttempt';
import { EvaluateAttemptUseCase } from '@/application/evaluation/evaluateAttempt';
import { RetryEvaluationUseCase } from '@/application/evaluation/retryEvaluation';
import { CompareAttemptsUseCase } from '@/application/history/compareAttempts';
import { GetAttemptHistoryUseCase } from '@/application/history/getAttemptHistory';
import { GetProblemByIdUseCase } from '@/application/problems/getProblemById';
import { GetProblemsUseCase } from '@/application/problems/getProblems';
import { PrismaAttemptRepository } from './db/repositories/PrismaAttemptRepository';
import { PrismaEvaluationRepository } from './db/repositories/PrismaEvaluationRepository';
import { PrismaProblemRepository } from './db/repositories/PrismaProblemRepository';
import { PrismaSubmissionRepository } from './db/repositories/PrismaSubmissionRepository';
import { CompositeEvaluator } from './evaluator/CompositeEvaluator';

// Repositories
export const problemRepository = new PrismaProblemRepository();
export const attemptRepository = new PrismaAttemptRepository();
export const submissionRepository = new PrismaSubmissionRepository();
export const evaluationRepository = new PrismaEvaluationRepository();

// Evaluator Engine
export const compositeEvaluator = new CompositeEvaluator();

// Use Cases
export const getProblemsUseCase = new GetProblemsUseCase(problemRepository);
export const getProblemByIdUseCase = new GetProblemByIdUseCase(problemRepository);
export const createAttemptUseCase = new CreateAttemptUseCase(
  problemRepository,
  attemptRepository,
  submissionRepository
);
export const saveDraftUseCase = new SaveDraftUseCase(attemptRepository, submissionRepository);
export const evaluateAttemptUseCase = new EvaluateAttemptUseCase(
  problemRepository,
  attemptRepository,
  submissionRepository,
  evaluationRepository,
  compositeEvaluator
);
export const submitAttemptUseCase = new SubmitAttemptUseCase(
  attemptRepository,
  submissionRepository,
  evaluateAttemptUseCase
);
export const retryEvaluationUseCase = new RetryEvaluationUseCase(
  attemptRepository,
  evaluateAttemptUseCase
);
export const getAttemptHistoryUseCase = new GetAttemptHistoryUseCase(
  attemptRepository,
  submissionRepository,
  evaluationRepository
);
export const compareAttemptsUseCase = new CompareAttemptsUseCase(
  attemptRepository,
  submissionRepository,
  evaluationRepository
);

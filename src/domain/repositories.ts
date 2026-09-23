import { Attempt } from './attempt/Attempt';
import { Evaluation } from './evaluation/Evaluation';
import { Problem } from './problem/Problem';
import { Submission } from './submission/Submission';

export interface IProblemRepository {
  findAll(): Promise<Problem[]>;
  findById(id: string): Promise<Problem | null>;
  findBySlug(slug: string): Promise<Problem | null>;
  save(problem: Problem): Promise<void>;
}

export interface IAttemptRepository {
  findById(id: string): Promise<Attempt | null>;
  findByProblemId(problemId: string): Promise<Attempt[]>;
  findLatestByProblemId(problemId: string): Promise<Attempt | null>;
  getNextAttemptNumber(problemId: string): Promise<number>;
  save(attempt: Attempt): Promise<void>;
}

export interface ISubmissionRepository {
  findById(id: string): Promise<Submission | null>;
  findByAttemptId(attemptId: string): Promise<Submission | null>;
  save(submission: Submission): Promise<void>;
}

export interface IEvaluationRepository {
  findById(id: string): Promise<Evaluation | null>;
  findByAttemptId(attemptId: string): Promise<Evaluation | null>;
  save(evaluation: Evaluation): Promise<void>;
}

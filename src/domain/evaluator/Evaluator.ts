import { EvaluationResult } from '../evaluation/types';
import { ProblemSnapshot } from '../problem/types';
import { RubricSnapshot } from '../rubric/Rubric';
import { SubmissionSnapshot } from '../submission/types';

export interface EvaluationInput {
  problem: ProblemSnapshot;
  submission: SubmissionSnapshot;
  rubric: RubricSnapshot;
}

export interface Evaluator {
  readonly name: string;
  evaluate(input: EvaluationInput): Promise<EvaluationResult>;
}

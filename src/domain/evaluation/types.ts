export type CriterionRating = 'STRONG' | 'ADEQUATE' | 'NEEDS_ATTENTION' | 'INCOMPLETE';

export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface CriterionFeedback {
  id: string;
  criterion: string;
  rating: CriterionRating;
  assessment: string;
  evidence: string;
  whyItMatters: string;
  concern: string;
  suggestion: string;
  confidence: ConfidenceLevel;
  score?: number;
}

export interface EvaluationResult {
  evaluatorType: string;
  rubricVersion: string;
  summary: string;
  strengths: string[];
  priorityImprovements: string[];
  criteria: CriterionFeedback[];
}

export type EvaluationLifecycleStatus = 'EVALUATING' | 'COMPLETED' | 'FAILED';

export interface EvaluationSnapshot {
  id: string;
  attemptId: string;
  submissionId: string;
  evaluatorType: string;
  rubricVersion: string;
  status: EvaluationLifecycleStatus;
  summary?: string | null;
  failureReason?: string | null;
  strengths: string[];
  priorityImprovements: string[];
  criteria: CriterionFeedback[];
  startedAt: Date;
  completedAt?: Date | null;
  failedAt?: Date | null;
  createdAt: Date;
}

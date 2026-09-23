export type AttemptStatus = 'DRAFT' | 'SUBMITTED' | 'EVALUATING' | 'COMPLETED' | 'FAILED';

export const ATTEMPT_STATUSES: Record<AttemptStatus, AttemptStatus> = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  EVALUATING: 'EVALUATING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
};

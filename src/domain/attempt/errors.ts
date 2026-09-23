import { AttemptStatus } from './AttemptStatus';

export class IllegalStateTransitionError extends Error {
  constructor(public readonly currentStatus: AttemptStatus, public readonly attemptedStatus: AttemptStatus) {
    super(`Cannot transition attempt from status '${currentStatus}' to '${attemptedStatus}'.`);
    this.name = 'IllegalStateTransitionError';
  }
}

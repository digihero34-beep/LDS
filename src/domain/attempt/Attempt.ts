import { AttemptStatus } from './AttemptStatus';
import { IllegalStateTransitionError } from './errors';

export interface AttemptSnapshot {
  id: string;
  problemId: string;
  attemptNumber: number;
  status: AttemptStatus;
  startedAt: Date;
  submittedAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Attempt {
  private _status: AttemptStatus;
  private _submittedAt: Date | null;
  private _completedAt: Date | null;
  private _updatedAt: Date;

  constructor(
    public readonly id: string,
    public readonly problemId: string,
    public readonly attemptNumber: number,
    status: AttemptStatus = 'DRAFT',
    public readonly startedAt: Date = new Date(),
    submittedAt: Date | null = null,
    completedAt: Date | null = null,
    public readonly createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    if (!id || id.trim() === '') throw new Error('Attempt ID is required');
    if (!problemId || problemId.trim() === '') throw new Error('Problem ID is required');
    if (attemptNumber <= 0) throw new Error('Attempt number must be positive');

    this._status = status;
    this._submittedAt = submittedAt;
    this._completedAt = completedAt;
    this._updatedAt = updatedAt;
  }

  public get status(): AttemptStatus {
    return this._status;
  }

  public get submittedAt(): Date | null {
    return this._submittedAt;
  }

  public get completedAt(): Date | null {
    return this._completedAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Transitions from DRAFT to SUBMITTED.
   */
  public transitionToSubmitted(timestamp: Date = new Date()): void {
    if (this._status !== 'DRAFT') {
      throw new IllegalStateTransitionError(this._status, 'SUBMITTED');
    }
    this._status = 'SUBMITTED';
    this._submittedAt = timestamp;
    this._updatedAt = timestamp;
  }

  /**
   * Transitions from SUBMITTED or FAILED to EVALUATING.
   */
  public transitionToEvaluating(timestamp: Date = new Date()): void {
    if (this._status !== 'SUBMITTED' && this._status !== 'FAILED') {
      throw new IllegalStateTransitionError(this._status, 'EVALUATING');
    }
    this._status = 'EVALUATING';
    this._updatedAt = timestamp;
  }

  /**
   * Transitions from EVALUATING to COMPLETED.
   */
  public transitionToCompleted(timestamp: Date = new Date()): void {
    if (this._status !== 'EVALUATING') {
      throw new IllegalStateTransitionError(this._status, 'COMPLETED');
    }
    this._status = 'COMPLETED';
    this._completedAt = timestamp;
    this._updatedAt = timestamp;
  }

  /**
   * Transitions from EVALUATING to FAILED.
   */
  public transitionToFailed(timestamp: Date = new Date()): void {
    if (this._status !== 'EVALUATING') {
      throw new IllegalStateTransitionError(this._status, 'FAILED');
    }
    this._status = 'FAILED';
    this._updatedAt = timestamp;
  }

  /**
   * Retry action for FAILED attempt, transitioning back to EVALUATING.
   */
  public retry(timestamp: Date = new Date()): void {
    if (this._status !== 'FAILED') {
      throw new IllegalStateTransitionError(this._status, 'EVALUATING');
    }
    this._status = 'EVALUATING';
    this._updatedAt = timestamp;
  }

  public toSnapshot(): AttemptSnapshot {
    return {
      id: this.id,
      problemId: this.problemId,
      attemptNumber: this.attemptNumber,
      status: this._status,
      startedAt: this.startedAt,
      submittedAt: this._submittedAt,
      completedAt: this._completedAt,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
  }

  public static fromSnapshot(snapshot: AttemptSnapshot): Attempt {
    return new Attempt(
      snapshot.id,
      snapshot.problemId,
      snapshot.attemptNumber,
      snapshot.status,
      new Date(snapshot.startedAt),
      snapshot.submittedAt ? new Date(snapshot.submittedAt) : null,
      snapshot.completedAt ? new Date(snapshot.completedAt) : null,
      new Date(snapshot.createdAt),
      new Date(snapshot.updatedAt)
    );
  }
}

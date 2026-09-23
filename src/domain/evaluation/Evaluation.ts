import { CriterionFeedback, EvaluationLifecycleStatus, EvaluationResult, EvaluationSnapshot } from './types';
export type { EvaluationSnapshot };

export class Evaluation {
  private _status: EvaluationLifecycleStatus;
  private _summary: string | null;
  private _failureReason: string | null;
  private _strengths: string[];
  private _priorityImprovements: string[];
  private _criteria: CriterionFeedback[];
  private _completedAt: Date | null;
  private _failedAt: Date | null;

  constructor(
    public readonly id: string,
    public readonly attemptId: string,
    public readonly submissionId: string,
    public readonly evaluatorType: string,
    public readonly rubricVersion: string,
    status: EvaluationLifecycleStatus = 'EVALUATING',
    summary: string | null = null,
    failureReason: string | null = null,
    strengths: string[] = [],
    priorityImprovements: string[] = [],
    criteria: CriterionFeedback[] = [],
    public readonly startedAt: Date = new Date(),
    completedAt: Date | null = null,
    failedAt: Date | null = null,
    public readonly createdAt: Date = new Date()
  ) {
    if (!id) throw new Error('Evaluation ID is required');
    if (!attemptId) throw new Error('Attempt ID is required');
    if (!submissionId) throw new Error('Submission ID is required');

    this._status = status;
    this._summary = summary;
    this._failureReason = failureReason;
    this._strengths = [...strengths];
    this._priorityImprovements = [...priorityImprovements];
    this._criteria = [...criteria];
    this._completedAt = completedAt;
    this._failedAt = failedAt;
  }

  public get status(): EvaluationLifecycleStatus {
    return this._status;
  }

  public get summary(): string | null {
    return this._summary;
  }

  public get failureReason(): string | null {
    return this._failureReason;
  }

  public get strengths(): string[] {
    return [...this._strengths];
  }

  public get priorityImprovements(): string[] {
    return [...this._priorityImprovements];
  }

  public get criteria(): CriterionFeedback[] {
    return [...this._criteria];
  }

  public get completedAt(): Date | null {
    return this._completedAt;
  }

  public get failedAt(): Date | null {
    return this._failedAt;
  }

  public complete(result: EvaluationResult, timestamp: Date = new Date()): void {
    if (this._status !== 'EVALUATING') {
      throw new Error(`Cannot complete evaluation from status '${this._status}'`);
    }
    this._status = 'COMPLETED';
    this._summary = result.summary;
    this._strengths = [...result.strengths];
    this._priorityImprovements = [...result.priorityImprovements];
    this._criteria = [...result.criteria];
    this._completedAt = timestamp;
  }

  public fail(reason: string, timestamp: Date = new Date()): void {
    if (this._status !== 'EVALUATING') {
      throw new Error(`Cannot fail evaluation from status '${this._status}'`);
    }
    this._status = 'FAILED';
    this._failureReason = reason;
    this._failedAt = timestamp;
  }

  public toSnapshot(): EvaluationSnapshot {
    return {
      id: this.id,
      attemptId: this.attemptId,
      submissionId: this.submissionId,
      evaluatorType: this.evaluatorType,
      rubricVersion: this.rubricVersion,
      status: this._status,
      summary: this._summary,
      failureReason: this._failureReason,
      strengths: [...this._strengths],
      priorityImprovements: [...this._priorityImprovements],
      criteria: JSON.parse(JSON.stringify(this._criteria)),
      startedAt: this.startedAt,
      completedAt: this._completedAt,
      failedAt: this._failedAt,
      createdAt: this.createdAt,
    };
  }

  public static fromSnapshot(snapshot: EvaluationSnapshot): Evaluation {
    return new Evaluation(
      snapshot.id,
      snapshot.attemptId,
      snapshot.submissionId,
      snapshot.evaluatorType,
      snapshot.rubricVersion,
      snapshot.status,
      snapshot.summary,
      snapshot.failureReason,
      snapshot.strengths,
      snapshot.priorityImprovements,
      snapshot.criteria,
      new Date(snapshot.startedAt),
      snapshot.completedAt ? new Date(snapshot.completedAt) : null,
      snapshot.failedAt ? new Date(snapshot.failedAt) : null,
      new Date(snapshot.createdAt)
    );
  }
}

import {
  ClassDesign,
  DesignDecision,
  EdgeCase,
  Relationship,
  SubmissionPayload,
  SubmissionSnapshot,
} from './types';

export class Submission {
  constructor(
    public readonly id: string,
    public readonly attemptId: string,
    public readonly version: number,
    public readonly requirementsUnderstanding: string,
    public readonly assumptions: string[],
    public readonly classes: ClassDesign[],
    public readonly relationships: Relationship[],
    public readonly designDecisions: DesignDecision[],
    public readonly edgeCases: EdgeCase[],
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {
    if (!id || id.trim() === '') throw new Error('Submission ID is required');
    if (!attemptId || attemptId.trim() === '') throw new Error('Attempt ID is required');
    if (version < 1) throw new Error('Submission version must be at least 1');
  }

  /**
   * Validates structural invariants: unique class names, non-empty responsibilities,
   * and relationship reference validity.
   */
  public validateInvariants(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check duplicate class names
    const classNames = new Set<string>();
    for (const cls of this.classes) {
      const lower = cls.name.trim().toLowerCase();
      if (!lower) {
        errors.push(`Class ${cls.id} has an empty name.`);
      } else if (classNames.has(lower)) {
        errors.push(`Duplicate class name detected: '${cls.name}'.`);
      } else {
        classNames.add(lower);
      }

      if (!cls.responsibility || cls.responsibility.trim() === '') {
        errors.push(`Class '${cls.name || cls.id}' has no defined responsibility.`);
      }
    }

    // Check relationship references
    for (const rel of this.relationships) {
      const fromLower = rel.fromClass.trim().toLowerCase();
      const toLower = rel.toClass.trim().toLowerCase();

      if (!classNames.has(fromLower)) {
        errors.push(`Relationship references unknown source class '${rel.fromClass}'.`);
      }
      if (!classNames.has(toLower)) {
        errors.push(`Relationship references unknown destination class '${rel.toClass}'.`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  public toSnapshot(): SubmissionSnapshot {
    return {
      id: this.id,
      attemptId: this.attemptId,
      version: this.version,
      requirementsUnderstanding: this.requirementsUnderstanding,
      assumptions: [...this.assumptions],
      classes: JSON.parse(JSON.stringify(this.classes)),
      relationships: JSON.parse(JSON.stringify(this.relationships)),
      designDecisions: JSON.parse(JSON.stringify(this.designDecisions)),
      edgeCases: JSON.parse(JSON.stringify(this.edgeCases)),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public static fromSnapshot(snapshot: SubmissionSnapshot): Submission {
    return new Submission(
      snapshot.id,
      snapshot.attemptId,
      snapshot.version,
      snapshot.requirementsUnderstanding,
      snapshot.assumptions,
      snapshot.classes,
      snapshot.relationships,
      snapshot.designDecisions,
      snapshot.edgeCases,
      new Date(snapshot.createdAt),
      new Date(snapshot.updatedAt)
    );
  }

  public static createDraft(
    id: string,
    attemptId: string,
    version: number,
    payload: SubmissionPayload
  ): Submission {
    return new Submission(
      id,
      attemptId,
      version,
      payload.requirementsUnderstanding,
      payload.assumptions,
      payload.classes,
      payload.relationships,
      payload.designDecisions,
      payload.edgeCases
    );
  }
}

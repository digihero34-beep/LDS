import { DifficultyLevel, ProblemConstraint, ProblemRequirement, ProblemSnapshot } from './types';

export class Problem {
  constructor(
    public readonly id: string,
    public readonly slug: string,
    public readonly title: string,
    public readonly difficulty: DifficultyLevel,
    public readonly estimatedMinutes: number,
    public readonly summary: string,
    public readonly requirements: ProblemRequirement[],
    public readonly constraints: ProblemConstraint[],
    public readonly skills: string[],
    public readonly evaluationHints: string[],
    public readonly active: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {
    if (!id || id.trim() === '') throw new Error('Problem ID is required');
    if (!slug || slug.trim() === '') throw new Error('Problem slug is required');
    if (!title || title.trim() === '') throw new Error('Problem title is required');
  }

  public toSnapshot(): ProblemSnapshot {
    return {
      id: this.id,
      slug: this.slug,
      title: this.title,
      difficulty: this.difficulty,
      estimatedMinutes: this.estimatedMinutes,
      summary: this.summary,
      requirements: [...this.requirements],
      constraints: [...this.constraints],
      skills: [...this.skills],
      evaluationHints: [...this.evaluationHints],
      active: this.active,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public static fromSnapshot(snapshot: ProblemSnapshot): Problem {
    return new Problem(
      snapshot.id,
      snapshot.slug,
      snapshot.title,
      snapshot.difficulty,
      snapshot.estimatedMinutes,
      snapshot.summary,
      snapshot.requirements,
      snapshot.constraints,
      snapshot.skills,
      snapshot.evaluationHints,
      snapshot.active,
      new Date(snapshot.createdAt),
      new Date(snapshot.updatedAt)
    );
  }
}

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export interface ProblemRequirement {
  id: string;
  category: 'FUNCTIONAL' | 'NON_FUNCTIONAL' | 'SCALE';
  description: string;
  priority: 'MUST_HAVE' | 'SHOULD_HAVE' | 'COULD_HAVE';
}

export interface ProblemConstraint {
  id: string;
  type: string;
  description: string;
}

export interface ProblemSnapshot {
  id: string;
  slug: string;
  title: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  summary: string;
  requirements: ProblemRequirement[];
  constraints: ProblemConstraint[];
  skills: string[];
  evaluationHints: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

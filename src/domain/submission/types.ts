export type ClassType = 'CLASS' | 'INTERFACE' | 'ABSTRACT_CLASS';

export type VisibilityModifier = '+' | '-' | '#';

export interface MethodDefinition {
  name: string;
  returnType: string;
  parameters: string[];
  visibility?: VisibilityModifier;
  responsibility?: string;
}

export interface ClassDesign {
  id: string;
  name: string;
  type: ClassType;
  responsibility: string;
  methods: MethodDefinition[];
  dependencies: string[];
  notes?: string;
}

export type RelationshipType = 'CONTAINS' | 'USES' | 'IMPLEMENTS' | 'EXTENDS' | 'DEPENDS_ON';

export interface Relationship {
  id: string;
  fromClass: string;
  toClass: string;
  type: RelationshipType;
  multiplicity?: string;
  rationale: string;
}

export interface DesignDecision {
  id: string;
  title: string;
  decision: string;
  rationale: string;
  tradeOffs?: string;
}

export interface EdgeCase {
  id: string;
  scenario: string;
  expectedBehavior: string;
  mitigation?: string;
}

export interface SubmissionPayload {
  requirementsUnderstanding: string;
  assumptions: string[];
  classes: ClassDesign[];
  relationships: Relationship[];
  designDecisions: DesignDecision[];
  edgeCases: EdgeCase[];
}

export interface SubmissionSnapshot extends SubmissionPayload {
  id: string;
  attemptId: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

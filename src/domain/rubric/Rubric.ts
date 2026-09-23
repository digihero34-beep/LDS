export interface RubricDimension {
  id: string;
  name: string;
  description: string;
  weight: number;
  evaluatorGuidance: string;
}

export interface RubricSnapshot {
  id: string;
  version: string;
  name: string;
  dimensions: RubricDimension[];
  active: boolean;
  createdAt: Date;
}

export class Rubric {
  constructor(
    public readonly id: string,
    public readonly version: string,
    public readonly name: string,
    public readonly dimensions: RubricDimension[],
    public readonly active: boolean = true,
    public readonly createdAt: Date = new Date()
  ) {
    if (!id) throw new Error('Rubric ID is required');
    if (!version) throw new Error('Rubric version is required');
    if (dimensions.length === 0) throw new Error('Rubric must have at least one dimension');
  }

  public toSnapshot(): RubricSnapshot {
    return {
      id: this.id,
      version: this.version,
      name: this.name,
      dimensions: [...this.dimensions],
      active: this.active,
      createdAt: this.createdAt,
    };
  }
}

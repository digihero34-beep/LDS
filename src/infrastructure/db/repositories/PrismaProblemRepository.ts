import { Problem } from '@/domain/problem/Problem';
import { DifficultyLevel } from '@/domain/problem/types';
import { IProblemRepository } from '@/domain/repositories';
import { prisma } from '../prisma';

export class PrismaProblemRepository implements IProblemRepository {
  async findAll(): Promise<Problem[]> {
    const records = await prisma.problem.findMany({
      where: { active: true },
      orderBy: { createdAt: 'asc' },
    });

    return records.map((r) => this.mapToDomain(r));
  }

  async findById(id: string): Promise<Problem | null> {
    const record = await prisma.problem.findUnique({
      where: { id },
    });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async findBySlug(slug: string): Promise<Problem | null> {
    const record = await prisma.problem.findUnique({
      where: { slug },
    });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async save(problem: Problem): Promise<void> {
    const snapshot = problem.toSnapshot();
    await prisma.problem.upsert({
      where: { id: snapshot.id },
      create: {
        id: snapshot.id,
        slug: snapshot.slug,
        title: snapshot.title,
        difficulty: snapshot.difficulty,
        estimatedMinutes: snapshot.estimatedMinutes,
        summary: snapshot.summary,
        requirements: JSON.stringify(snapshot.requirements),
        constraints: JSON.stringify(snapshot.constraints),
        skills: JSON.stringify(snapshot.skills),
        evaluationHints: JSON.stringify(snapshot.evaluationHints),
        active: snapshot.active,
        createdAt: snapshot.createdAt,
        updatedAt: snapshot.updatedAt,
      },
      update: {
        slug: snapshot.slug,
        title: snapshot.title,
        difficulty: snapshot.difficulty,
        estimatedMinutes: snapshot.estimatedMinutes,
        summary: snapshot.summary,
        requirements: JSON.stringify(snapshot.requirements),
        constraints: JSON.stringify(snapshot.constraints),
        skills: JSON.stringify(snapshot.skills),
        evaluationHints: JSON.stringify(snapshot.evaluationHints),
        active: snapshot.active,
        updatedAt: snapshot.updatedAt,
      },
    });
  }

  private mapToDomain(record: {
    id: string;
    slug: string;
    title: string;
    difficulty: string;
    estimatedMinutes: number;
    summary: string;
    requirements: string;
    constraints: string;
    skills: string;
    evaluationHints: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Problem {
    return new Problem(
      record.id,
      record.slug,
      record.title,
      record.difficulty as DifficultyLevel,
      record.estimatedMinutes,
      record.summary,
      JSON.parse(record.requirements),
      JSON.parse(record.constraints),
      JSON.parse(record.skills),
      JSON.parse(record.evaluationHints),
      record.active,
      record.createdAt,
      record.updatedAt
    );
  }
}

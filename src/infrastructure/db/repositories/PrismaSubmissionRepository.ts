import { ISubmissionRepository } from '@/domain/repositories';
import { Submission } from '@/domain/submission/Submission';
import { prisma } from '../prisma';

export class PrismaSubmissionRepository implements ISubmissionRepository {
  async findById(id: string): Promise<Submission | null> {
    const record = await prisma.submission.findUnique({
      where: { id },
    });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async findByAttemptId(attemptId: string): Promise<Submission | null> {
    const record = await prisma.submission.findFirst({
      where: { attemptId },
      orderBy: { version: 'desc' },
    });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async save(submission: Submission): Promise<void> {
    const snapshot = submission.toSnapshot();
    await prisma.submission.upsert({
      where: { id: snapshot.id },
      create: {
        id: snapshot.id,
        attemptId: snapshot.attemptId,
        version: snapshot.version,
        requirementsUnderstanding: snapshot.requirementsUnderstanding,
        assumptions: JSON.stringify(snapshot.assumptions),
        classes: JSON.stringify(snapshot.classes),
        relationships: JSON.stringify(snapshot.relationships),
        designDecisions: JSON.stringify(snapshot.designDecisions),
        edgeCases: JSON.stringify(snapshot.edgeCases),
        createdAt: snapshot.createdAt,
        updatedAt: snapshot.updatedAt,
      },
      update: {
        version: snapshot.version,
        requirementsUnderstanding: snapshot.requirementsUnderstanding,
        assumptions: JSON.stringify(snapshot.assumptions),
        classes: JSON.stringify(snapshot.classes),
        relationships: JSON.stringify(snapshot.relationships),
        designDecisions: JSON.stringify(snapshot.designDecisions),
        edgeCases: JSON.stringify(snapshot.edgeCases),
        updatedAt: snapshot.updatedAt,
      },
    });
  }

  private mapToDomain(record: {
    id: string;
    attemptId: string;
    version: number;
    requirementsUnderstanding: string;
    assumptions: string;
    classes: string;
    relationships: string;
    designDecisions: string;
    edgeCases: string;
    createdAt: Date;
    updatedAt: Date;
  }): Submission {
    return new Submission(
      record.id,
      record.attemptId,
      record.version,
      record.requirementsUnderstanding,
      JSON.parse(record.assumptions),
      JSON.parse(record.classes),
      JSON.parse(record.relationships),
      JSON.parse(record.designDecisions),
      JSON.parse(record.edgeCases),
      record.createdAt,
      record.updatedAt
    );
  }
}

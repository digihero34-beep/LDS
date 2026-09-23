import { Attempt } from '@/domain/attempt/Attempt';
import { AttemptStatus } from '@/domain/attempt/AttemptStatus';
import { IAttemptRepository } from '@/domain/repositories';
import { prisma } from '../prisma';

export class PrismaAttemptRepository implements IAttemptRepository {
  async findById(id: string): Promise<Attempt | null> {
    const record = await prisma.attempt.findUnique({
      where: { id },
    });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async findByProblemId(problemId: string): Promise<Attempt[]> {
    const records = await prisma.attempt.findMany({
      where: { problemId },
      orderBy: { attemptNumber: 'desc' },
    });
    return records.map((r) => this.mapToDomain(r));
  }

  async findLatestByProblemId(problemId: string): Promise<Attempt | null> {
    const record = await prisma.attempt.findFirst({
      where: { problemId },
      orderBy: { attemptNumber: 'desc' },
    });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async getNextAttemptNumber(problemId: string): Promise<number> {
    const latest = await prisma.attempt.findFirst({
      where: { problemId },
      orderBy: { attemptNumber: 'desc' },
      select: { attemptNumber: true },
    });
    return (latest?.attemptNumber ?? 0) + 1;
  }

  async save(attempt: Attempt): Promise<void> {
    const snapshot = attempt.toSnapshot();
    await prisma.attempt.upsert({
      where: { id: snapshot.id },
      create: {
        id: snapshot.id,
        problemId: snapshot.problemId,
        attemptNumber: snapshot.attemptNumber,
        status: snapshot.status,
        startedAt: snapshot.startedAt,
        submittedAt: snapshot.submittedAt,
        completedAt: snapshot.completedAt,
        createdAt: snapshot.createdAt,
        updatedAt: snapshot.updatedAt,
      },
      update: {
        status: snapshot.status,
        submittedAt: snapshot.submittedAt,
        completedAt: snapshot.completedAt,
        updatedAt: snapshot.updatedAt,
      },
    });
  }

  private mapToDomain(record: {
    id: string;
    problemId: string;
    attemptNumber: number;
    status: string;
    startedAt: Date;
    submittedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Attempt {
    return new Attempt(
      record.id,
      record.problemId,
      record.attemptNumber,
      record.status as AttemptStatus,
      record.startedAt,
      record.submittedAt,
      record.completedAt,
      record.createdAt,
      record.updatedAt
    );
  }
}

import { Evaluation } from '@/domain/evaluation/Evaluation';
import {
  ConfidenceLevel,
  CriterionFeedback,
  CriterionRating,
  EvaluationLifecycleStatus,
} from '@/domain/evaluation/types';
import { IEvaluationRepository } from '@/domain/repositories';
import { prisma } from '../prisma';

export class PrismaEvaluationRepository implements IEvaluationRepository {
  async findById(id: string): Promise<Evaluation | null> {
    const record = await prisma.evaluation.findUnique({
      where: { id },
      include: { feedback: true },
    });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async findByAttemptId(attemptId: string): Promise<Evaluation | null> {
    const record = await prisma.evaluation.findFirst({
      where: { attemptId },
      orderBy: { createdAt: 'desc' },
      include: { feedback: true },
    });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async save(evaluation: Evaluation): Promise<void> {
    const snapshot = evaluation.toSnapshot();

    await prisma.$transaction(async (tx) => {
      await tx.evaluation.upsert({
        where: { id: snapshot.id },
        create: {
          id: snapshot.id,
          attemptId: snapshot.attemptId,
          submissionId: snapshot.submissionId,
          evaluatorType: snapshot.evaluatorType,
          rubricVersion: snapshot.rubricVersion,
          status: snapshot.status,
          summary: snapshot.summary,
          failureReason: snapshot.failureReason,
          strengths: JSON.stringify(snapshot.strengths),
          priorityImprovements: JSON.stringify(snapshot.priorityImprovements),
          startedAt: snapshot.startedAt,
          completedAt: snapshot.completedAt,
          failedAt: snapshot.failedAt,
          createdAt: snapshot.createdAt,
        },
        update: {
          status: snapshot.status,
          summary: snapshot.summary,
          failureReason: snapshot.failureReason,
          strengths: JSON.stringify(snapshot.strengths),
          priorityImprovements: JSON.stringify(snapshot.priorityImprovements),
          completedAt: snapshot.completedAt,
          failedAt: snapshot.failedAt,
        },
      });

      // Clear previous feedback for this evaluation and re-insert
      await tx.feedback.deleteMany({
        where: { evaluationId: snapshot.id },
      });

      if (snapshot.criteria.length > 0) {
        await tx.feedback.createMany({
          data: snapshot.criteria.map((c, idx) => ({
            id: `${snapshot.id}-${c.id || 'crit'}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
            evaluationId: snapshot.id,
            criterion: c.criterion,
            rating: c.rating,
            score: c.score ?? null,
            assessment: c.assessment,
            evidence: c.evidence,
            whyItMatters: c.whyItMatters,
            concern: c.concern,
            suggestion: c.suggestion,
            confidence: c.confidence,
          })),
        });
      }
    });
  }

  private mapToDomain(record: {
    id: string;
    attemptId: string;
    submissionId: string;
    evaluatorType: string;
    rubricVersion: string;
    status: string;
    summary: string | null;
    failureReason: string | null;
    strengths: string;
    priorityImprovements: string;
    startedAt: Date;
    completedAt: Date | null;
    failedAt: Date | null;
    createdAt: Date;
    feedback: Array<{
      id: string;
      evaluationId: string;
      criterion: string;
      rating: string;
      score: number | null;
      assessment: string;
      evidence: string;
      whyItMatters: string;
      concern: string;
      suggestion: string;
      confidence: string;
      createdAt: Date;
    }>;
  }): Evaluation {
    const criteria: CriterionFeedback[] = record.feedback.map((f) => ({
      id: f.id,
      criterion: f.criterion,
      rating: f.rating as CriterionRating,
      score: f.score ?? undefined,
      assessment: f.assessment,
      evidence: f.evidence,
      whyItMatters: f.whyItMatters,
      concern: f.concern,
      suggestion: f.suggestion,
      confidence: f.confidence as ConfidenceLevel,
    }));

    return new Evaluation(
      record.id,
      record.attemptId,
      record.submissionId,
      record.evaluatorType,
      record.rubricVersion,
      record.status as EvaluationLifecycleStatus,
      record.summary,
      record.failureReason,
      JSON.parse(record.strengths || '[]'),
      JSON.parse(record.priorityImprovements || '[]'),
      criteria,
      record.startedAt,
      record.completedAt,
      record.failedAt,
      record.createdAt
    );
  }
}

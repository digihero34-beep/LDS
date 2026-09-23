import { AttemptSnapshot } from '@/domain/attempt/Attempt';
import { CriterionFeedback, EvaluationSnapshot } from '@/domain/evaluation/types';
import { IAttemptRepository, IEvaluationRepository, ISubmissionRepository } from '@/domain/repositories';
import { ClassDesign, Relationship, SubmissionSnapshot } from '@/domain/submission/types';

export interface ClassDiff {
  name: string;
  changeType: 'ADDED' | 'REMOVED' | 'MODIFIED' | 'UNCHANGED';
  before?: ClassDesign;
  after?: ClassDesign;
  details?: string[];
}

export interface RelationshipDiff {
  summary: string;
  changeType: 'ADDED' | 'REMOVED' | 'UNCHANGED';
  relationship: Relationship;
}

export interface CriterionDiff {
  criterion: string;
  beforeRating?: string;
  afterRating?: string;
  status: 'IMPROVED' | 'REGRESSED' | 'UNCHANGED' | 'NEW';
  beforeEvidence?: string;
  afterEvidence?: string;
  concernResolved?: boolean;
}

export interface AttemptComparisonResult {
  baseAttempt: AttemptSnapshot;
  targetAttempt: AttemptSnapshot;
  baseSubmission: SubmissionSnapshot | null;
  targetSubmission: SubmissionSnapshot | null;
  baseEvaluation: EvaluationSnapshot | null;
  targetEvaluation: EvaluationSnapshot | null;
  classesDiff: ClassDiff[];
  relationshipsDiff: RelationshipDiff[];
  criteriaDiff: CriterionDiff[];
  summary: string;
  nextChallenge: string;
}

export class CompareAttemptsUseCase {
  constructor(
    private readonly attemptRepo: IAttemptRepository,
    private readonly submissionRepo: ISubmissionRepository,
    private readonly evaluationRepo: IEvaluationRepository
  ) {}

  async execute(baseAttemptId: string, targetAttemptId: string): Promise<AttemptComparisonResult> {
    const baseAttempt = await this.attemptRepo.findById(baseAttemptId);
    const targetAttempt = await this.attemptRepo.findById(targetAttemptId);

    if (!baseAttempt || !targetAttempt) {
      throw new Error('One or both attempts for comparison could not be found.');
    }

    const baseSubmission = await this.submissionRepo.findByAttemptId(baseAttemptId);
    const targetSubmission = await this.submissionRepo.findByAttemptId(targetAttemptId);

    const baseEval = await this.evaluationRepo.findByAttemptId(baseAttemptId);
    const targetEval = await this.evaluationRepo.findByAttemptId(targetAttemptId);

    const baseSubSnap = baseSubmission ? baseSubmission.toSnapshot() : null;
    const targetSubSnap = targetSubmission ? targetSubmission.toSnapshot() : null;

    // 1. Classes Diff
    const baseClasses = new Map<string, ClassDesign>(
      (baseSubSnap?.classes || []).map((c) => [c.name.toLowerCase(), c])
    );
    const targetClasses = new Map<string, ClassDesign>(
      (targetSubSnap?.classes || []).map((c) => [c.name.toLowerCase(), c])
    );

    const classesDiff: ClassDiff[] = [];

    // Check target classes (Added or Modified or Unchanged)
    for (const [lowerName, targetCls] of targetClasses.entries()) {
      if (!baseClasses.has(lowerName)) {
        classesDiff.push({
          name: targetCls.name,
          changeType: 'ADDED',
          after: targetCls,
          details: [`Added class with responsibility: "${targetCls.responsibility}"`],
        });
      } else {
        const baseCls = baseClasses.get(lowerName)!;
        const details: string[] = [];

        if (baseCls.responsibility !== targetCls.responsibility) {
          details.push(`Updated responsibility from "${baseCls.responsibility}" to "${targetCls.responsibility}"`);
        }
        if (baseCls.type !== targetCls.type) {
          details.push(`Changed type from ${baseCls.type} to ${targetCls.type}`);
        }

        const baseMethodNames = new Set(baseCls.methods.map((m) => m.name.toLowerCase()));
        const targetMethodNames = new Set(targetCls.methods.map((m) => m.name.toLowerCase()));

        for (const tm of targetCls.methods) {
          if (!baseMethodNames.has(tm.name.toLowerCase())) {
            details.push(`+ Added method: ${tm.name}()`);
          }
        }
        for (const bm of baseCls.methods) {
          if (!targetMethodNames.has(bm.name.toLowerCase())) {
            details.push(`- Removed method: ${bm.name}()`);
          }
        }

        classesDiff.push({
          name: targetCls.name,
          changeType: details.length > 0 ? 'MODIFIED' : 'UNCHANGED',
          before: baseCls,
          after: targetCls,
          details: details.length > 0 ? details : undefined,
        });
      }
    }

    // Check removed classes
    for (const [lowerName, baseCls] of baseClasses.entries()) {
      if (!targetClasses.has(lowerName)) {
        classesDiff.push({
          name: baseCls.name,
          changeType: 'REMOVED',
          before: baseCls,
          details: [`Removed class previously responsible for: "${baseCls.responsibility}"`],
        });
      }
    }

    // 2. Relationships Diff
    const baseRels = baseSubSnap?.relationships || [];
    const targetRels = targetSubSnap?.relationships || [];
    const relationshipsDiff: RelationshipDiff[] = [];

    const baseRelKeys = new Set(baseRels.map((r) => `${r.fromClass.toLowerCase()}->${r.toClass.toLowerCase()}:${r.type}`));
    const targetRelKeys = new Set(targetRels.map((r) => `${r.fromClass.toLowerCase()}->${r.toClass.toLowerCase()}:${r.type}`));

    for (const tr of targetRels) {
      const key = `${tr.fromClass.toLowerCase()}->${tr.toClass.toLowerCase()}:${tr.type}`;
      relationshipsDiff.push({
        summary: `${tr.fromClass} ${tr.type} ${tr.toClass}`,
        changeType: baseRelKeys.has(key) ? 'UNCHANGED' : 'ADDED',
        relationship: tr,
      });
    }

    for (const br of baseRels) {
      const key = `${br.fromClass.toLowerCase()}->${br.toClass.toLowerCase()}:${br.type}`;
      if (!targetRelKeys.has(key)) {
        relationshipsDiff.push({
          summary: `${br.fromClass} ${br.type} ${br.toClass}`,
          changeType: 'REMOVED',
          relationship: br,
        });
      }
    }

    // 3. Rubric & Evaluation Diff
    const criteriaDiff: CriterionDiff[] = [];
    const baseCriteriaMap = new Map<string, CriterionFeedback>(
      (baseEval?.criteria || []).map((c) => [c.criterion, c])
    );
    const targetCriteriaMap = new Map<string, CriterionFeedback>(
      (targetEval?.criteria || []).map((c) => [c.criterion, c])
    );

    const ratingRank = (r?: string) => {
      switch (r) {
        case 'STRONG': return 3;
        case 'ADEQUATE': return 2;
        case 'NEEDS_ATTENTION': return 1;
        case 'INCOMPLETE': return 0;
        default: return -1;
      }
    };

    for (const [criterion, targetCrit] of targetCriteriaMap.entries()) {
      const baseCrit = baseCriteriaMap.get(criterion);
      const bRank = ratingRank(baseCrit?.rating);
      const tRank = ratingRank(targetCrit.rating);

      let status: 'IMPROVED' | 'REGRESSED' | 'UNCHANGED' | 'NEW' = 'UNCHANGED';
      if (!baseCrit) {
        status = 'NEW';
      } else if (tRank > bRank) {
        status = 'IMPROVED';
      } else if (tRank < bRank) {
        status = 'REGRESSED';
      }

      criteriaDiff.push({
        criterion,
        beforeRating: baseCrit?.rating,
        afterRating: targetCrit.rating,
        status,
        beforeEvidence: baseCrit?.evidence,
        afterEvidence: targetCrit.evidence,
        concernResolved: bRank < 3 && tRank >= 2,
      });
    }

    // Next Design Challenge synthesis
    const nextChallenge =
      targetClasses.has('pricingstrategy')
        ? 'Next design challenge: Extend the design to support real-time Electric Vehicle (EV) charging stations and battery kilowatt telemetry without modifying ParkingLot.'
        : 'Next design challenge: Extract pricing calculation from the main orchestrator into an isolated Strategy pattern interface.';

    return {
      baseAttempt: baseAttempt.toSnapshot(),
      targetAttempt: targetAttempt.toSnapshot(),
      baseSubmission: baseSubSnap,
      targetSubmission: targetSubSnap,
      baseEvaluation: baseEval ? baseEval.toSnapshot() : null,
      targetEvaluation: targetEval ? targetEval.toSnapshot() : null,
      classesDiff,
      relationshipsDiff,
      criteriaDiff,
      summary: `Comparison between Attempt #${baseAttempt.attemptNumber} and Attempt #${targetAttempt.attemptNumber} reveals ${classesDiff.filter((c) => c.changeType === 'ADDED').length} added class(es), ${classesDiff.filter((c) => c.changeType === 'MODIFIED').length} modified class(es), and ${criteriaDiff.filter((c) => c.status === 'IMPROVED').length} improved evaluation dimension(s).`,
      nextChallenge,
    };
  }
}

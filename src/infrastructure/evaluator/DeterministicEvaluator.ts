import { SubmissionSnapshot } from '@/domain/submission/types';

export interface DesignSignal {
  id: string;
  label: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  message: string;
}

export interface DeterministicInspectionResult {
  isValid: boolean;
  readinessScore: number; // e.g. 5
  totalSignals: number; // e.g. 6
  blockingErrors: string[];
  signals: DesignSignal[];
}

export class DeterministicEvaluator {
  public inspect(submission: SubmissionSnapshot): DeterministicInspectionResult {
    const signals: DesignSignal[] = [];
    const blockingErrors: string[] = [];

    // 1. Requirements Signal
    const reqTrimmed = (submission.requirementsUnderstanding || '').trim();
    if (reqTrimmed.length >= 20) {
      signals.push({
        id: 'requirements',
        label: 'Requirements captured',
        status: 'PASS',
        message: `${reqTrimmed.length} characters of requirements understanding captured.`,
      });
    } else if (reqTrimmed.length > 0) {
      signals.push({
        id: 'requirements',
        label: 'Requirements understanding brief',
        status: 'WARN',
        message: 'Requirements description is very short. Elaborate core operations and scope.',
      });
    } else {
      signals.push({
        id: 'requirements',
        label: 'Requirements missing',
        status: 'FAIL',
        message: 'Specify your understanding of problem requirements before submission.',
      });
      blockingErrors.push('Requirements understanding section is required.');
    }

    // 2. Class Definitions Signal
    const classes = submission.classes || [];
    if (classes.length === 0) {
      signals.push({
        id: 'classes',
        label: 'No classes defined',
        status: 'FAIL',
        message: 'At least one class or interface must be defined.',
      });
      blockingErrors.push('At least one class, interface, or abstract class must be defined.');
    } else {
      // Check duplicate class names
      const seenNames = new Set<string>();
      const duplicates: string[] = [];
      let missingResponsibilities = 0;

      for (const cls of classes) {
        const lower = (cls.name || '').trim().toLowerCase();
        if (!lower) {
          duplicates.push('Unnamed class');
        } else if (seenNames.has(lower)) {
          duplicates.push(cls.name);
        } else {
          seenNames.add(lower);
        }

        if (!cls.responsibility || cls.responsibility.trim().length === 0) {
          missingResponsibilities++;
        }
      }

      if (duplicates.length > 0) {
        signals.push({
          id: 'classes-duplicates',
          label: 'Duplicate class names',
          status: 'FAIL',
          message: `Duplicate class names: ${duplicates.join(', ')}.`,
        });
        blockingErrors.push(`Duplicate class names detected: ${duplicates.join(', ')}.`);
      }

      if (missingResponsibilities > 0) {
        signals.push({
          id: 'responsibilities',
          label: 'Responsibilities undefined',
          status: 'FAIL',
          message: `${missingResponsibilities} class(es) have empty responsibilities.`,
        });
        blockingErrors.push('Every defined class must have a clearly stated responsibility.');
      } else {
        signals.push({
          id: 'responsibilities',
          label: 'Responsibilities defined',
          status: 'PASS',
          message: `All ${classes.length} classes have documented responsibilities.`,
        });
      }
    }

    // 3. Relationships & Graph Integrity
    const relationships = submission.relationships || [];
    const validClassNames = new Set((classes || []).map((c) => (c.name || '').trim().toLowerCase()));
    let danglingRefs = 0;
    let missingRationale = 0;

    for (const rel of relationships) {
      const fromLower = (rel.fromClass || '').trim().toLowerCase();
      const toLower = (rel.toClass || '').trim().toLowerCase();

      if (!validClassNames.has(fromLower) || !validClassNames.has(toLower)) {
        danglingRefs++;
      }
      if (!rel.rationale || rel.rationale.trim().length === 0) {
        missingRationale++;
      }
    }

    if (danglingRefs > 0) {
      signals.push({
        id: 'relationships-integrity',
        label: 'Broken relationship links',
        status: 'FAIL',
        message: `${danglingRefs} relationship(s) reference non-existent classes.`,
      });
      blockingErrors.push('All relationships must point to valid, defined classes in the design sheet.');
    } else if (relationships.length > 0) {
      signals.push({
        id: 'relationships-integrity',
        label: 'Relationships connected',
        status: 'PASS',
        message: `${relationships.length} relationships properly connected between entities.`,
      });
    } else if (classes.length > 1) {
      signals.push({
        id: 'relationships-integrity',
        label: 'No relationships defined',
        status: 'WARN',
        message: 'Multiple classes exist but no structural relationships connect them.',
      });
    }

    // Relationship rationale
    if (relationships.length > 0 && missingRationale > 0) {
      signals.push({
        id: 'relationship-rationale',
        label: 'Relationship rationale incomplete',
        status: 'WARN',
        message: `${missingRationale} relationship(s) lack architectural justification.`,
      });
    } else if (relationships.length > 0) {
      signals.push({
        id: 'relationship-rationale',
        label: 'Relationship rationale documented',
        status: 'PASS',
        message: 'All relationships include architectural justification.',
      });
    }

    // 4. Design Decisions & Trade-offs
    const decisions = submission.designDecisions || [];
    if (decisions.length >= 1) {
      signals.push({
        id: 'trade-offs',
        label: 'Trade-offs explained',
        status: 'PASS',
        message: `${decisions.length} architectural decision(s) / trade-off(s) captured.`,
      });
    } else {
      signals.push({
        id: 'trade-offs',
        label: 'Trade-offs missing',
        status: 'WARN',
        message: 'Document at least one key design trade-off or abstraction rationale.',
      });
    }

    // 5. Edge Cases
    const edgeCases = submission.edgeCases || [];
    if (edgeCases.length >= 2) {
      signals.push({
        id: 'edge-cases',
        label: 'Edge cases captured',
        status: 'PASS',
        message: `${edgeCases.length} edge-case scenario(s) covered with expected behaviors.`,
      });
    } else if (edgeCases.length === 1) {
      signals.push({
        id: 'edge-cases',
        label: 'Edge-case coverage limited',
        status: 'WARN',
        message: 'Only 1 edge case defined. Consider failure modes and boundary conditions.',
      });
    } else {
      signals.push({
        id: 'edge-cases',
        label: 'Edge cases missing',
        status: 'WARN',
        message: 'Document edge cases (e.g. resource exhaustion, race conditions, invalid input).',
      });
    }

    const passedSignals = signals.filter((s) => s.status === 'PASS').length;

    return {
      isValid: blockingErrors.length === 0,
      readinessScore: passedSignals,
      totalSignals: signals.length,
      blockingErrors,
      signals,
    };
  }
}

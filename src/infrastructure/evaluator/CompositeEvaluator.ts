import { EvaluationResult } from '@/domain/evaluation/types';
import { EvaluationInput, Evaluator } from '@/domain/evaluator/Evaluator';
import { AIEvaluator } from './AIEvaluator';
import { DeterministicEvaluator, DeterministicInspectionResult } from './DeterministicEvaluator';
import { HeuristicEvaluator } from './HeuristicEvaluator';

export class CompositeEvaluator implements Evaluator {
  public readonly name = 'COMPOSITE_WORKBENCH_EVALUATOR';
  private readonly deterministicEvaluator = new DeterministicEvaluator();
  private readonly aiEvaluator = new AIEvaluator();
  private readonly heuristicEvaluator = new HeuristicEvaluator();

  public preCheck(input: EvaluationInput): DeterministicInspectionResult {
    return this.deterministicEvaluator.inspect(input.submission);
  }

  public async evaluate(input: EvaluationInput): Promise<EvaluationResult> {
    // 1. Run deterministic checks
    const inspection = this.deterministicEvaluator.inspect(input.submission);
    if (!inspection.isValid) {
      throw new Error(`Deterministic validation failed: ${inspection.blockingErrors.join(' ')}`);
    }

    // 2. Attempt AI Evaluation if API key configured
    if (process.env.LLM_API_KEY && process.env.LLM_API_KEY.trim() !== '') {
      try {
        return await this.aiEvaluator.evaluate(input);
      } catch (aiError) {
        console.warn('AI Evaluator failed or timed out, falling back to heuristic engine:', aiError);
        // Fall back cleanly to Heuristic Evaluator so user work is never lost
        const fallbackResult = await this.heuristicEvaluator.evaluate(input);
        return {
          ...fallbackResult,
          summary: `${fallbackResult.summary} (Evaluated via workbench offline heuristic engine).`,
        };
      }
    }

    // 3. Default to Heuristic Evaluator for zero-config local execution & recruiter demo
    return await this.heuristicEvaluator.evaluate(input);
  }
}

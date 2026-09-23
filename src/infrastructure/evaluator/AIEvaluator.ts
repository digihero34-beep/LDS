import { CriterionFeedback, EvaluationResult } from '@/domain/evaluation/types';
import { EvaluationInput, Evaluator } from '@/domain/evaluator/Evaluator';
import { z } from 'zod';

const CriterionResultSchema = z.object({
  criterion: z.string(),
  rating: z.enum(['STRONG', 'ADEQUATE', 'NEEDS_ATTENTION', 'INCOMPLETE']),
  score: z.number().optional(),
  assessment: z.string(),
  evidence: z.string(),
  whyItMatters: z.string(),
  concern: z.string(),
  suggestion: z.string(),
  confidence: z.enum(['LOW', 'MEDIUM', 'HIGH']),
});

const EvaluationResultSchema = z.object({
  summary: z.string(),
  strengths: z.array(z.string()),
  priorityImprovements: z.array(z.string()),
  criteria: z.array(CriterionResultSchema),
});

export class AIEvaluator implements Evaluator {
  public readonly name: string;

  constructor(
    private readonly apiKey: string = process.env.LLM_API_KEY || '',
    private readonly model: string = process.env.LLM_MODEL || (process.env.LLM_API_KEY?.startsWith('gsk_') ? 'qwen/qwen3.8-27b' : 'gemini-2.5-flash'),
    private readonly provider: string = process.env.LLM_PROVIDER || (process.env.LLM_API_KEY?.startsWith('gsk_') ? 'Groq' : 'gemini')
  ) {
    this.name = this.provider.toLowerCase() === 'groq' || this.apiKey.startsWith('gsk_') ? 'LLM_ADAPTER_GROQ_V1' : 'LLM_ADAPTER_GEMINI_V1';
  }

  public async evaluate(input: EvaluationInput): Promise<EvaluationResult> {
    if (!this.apiKey || this.apiKey.trim() === '') {
      throw new Error('LLM_API_KEY is not configured.');
    }

    const prompt = this.buildPrompt(input);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const isGroq = this.provider.toLowerCase() === 'groq' || this.apiKey.startsWith('gsk_');

    try {
      let response: Response;

      if (isGroq) {
        response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages: [
              {
                role: 'system',
                content: 'You are a Principal Software Architect conducting an objective, evidence-based Low-Level Design (LLD) review. Always output valid JSON strictly matching the requested schema.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2,
          }),
          signal: controller.signal,
        });
      } else {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
          signal: controller.signal,
        });
      }

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LLM provider HTTP ${response.status}: ${errorText.slice(0, 150)}`);
      }

      const responseJson = await response.json();
      const rawText = isGroq
        ? responseJson.choices?.[0]?.message?.content || ''
        : responseJson.candidates?.[0]?.content?.parts?.[0]?.text ||
          responseJson.text ||
          '';

      if (!rawText) {
        throw new Error('Empty response received from LLM provider.');
      }

      const parsedJson = JSON.parse(rawText);
      const validated = EvaluationResultSchema.safeParse(parsedJson);

      if (!validated.success) {
        throw new Error(`Malformed LLM output: ${validated.error.message}`);
      }

      const data = validated.data;
      const criteria: CriterionFeedback[] = data.criteria.map((c, index) => ({
        id: `fb-ai-${index + 1}`,
        criterion: c.criterion,
        rating: c.rating,
        score: c.score,
        assessment: c.assessment,
        evidence: c.evidence,
        whyItMatters: c.whyItMatters,
        concern: c.concern,
        suggestion: c.suggestion,
        confidence: c.confidence,
      }));

      return {
        evaluatorType: this.name,
        rubricVersion: input.rubric.version,
        summary: data.summary,
        strengths: data.strengths,
        priorityImprovements: data.priorityImprovements,
        criteria,
      };
    } catch (err: unknown) {
      clearTimeout(timeout);
      const message = err instanceof Error ? err.message : 'Unknown evaluation failure';
      throw new Error(`AI Evaluation failed: ${message}`);
    }
  }

  private buildPrompt(input: EvaluationInput): string {
    const { problem, submission, rubric } = input;

    return `You are a Principal Software Architect conducting an objective, evidence-based Low-Level Design (LLD) review.

CRITICAL INSTRUCTIONS:
1. There is NO single "correct" reference class diagram. Recognize multiple valid designs. Do not penalize deviations from a textbook design if the submitted design satisfies the requirements with clean OOP boundaries.
2. Evaluate based on evidence in the submission. Do NOT hallucinate classes, methods, or requirements not present. If evidence is missing, state that it is missing.
3. Every criterion must include:
   - "criterion": Name of rubric dimension
   - "rating": "STRONG" | "ADEQUATE" | "NEEDS_ATTENTION" | "INCOMPLETE"
   - "score": optional number 1-10
   - "assessment": Clear concise evaluation
   - "evidence": Specific citation from candidate submission (e.g. "ParkingLot.calculateFee()", "Class Level contains ParkingSpot[]")
   - "whyItMatters": Architectural principle/reason why this is good or problematic
   - "concern": Potential risk, regression, or coupling issue
   - "suggestion": Concrete, actionable change to improve the next attempt
   - "confidence": "LOW" | "MEDIUM" | "HIGH"
4. Output STRICT JSON conforming to this schema:
{
  "summary": "...",
  "strengths": ["...", "..."],
  "priorityImprovements": ["...", "..."],
  "criteria": [
    {
      "criterion": "...",
      "rating": "STRONG",
      "score": 8.5,
      "assessment": "...",
      "evidence": "...",
      "whyItMatters": "...",
      "concern": "...",
      "suggestion": "...",
      "confidence": "HIGH"
    }
  ]
}

PROBLEM CONTEXT:
Title: ${problem.title}
Difficulty: ${problem.difficulty}
Summary: ${problem.summary}
Requirements: ${JSON.stringify(problem.requirements)}
Constraints: ${JSON.stringify(problem.constraints)}

RUBRIC DIMENSIONS TO EVALUATE:
${JSON.stringify(rubric.dimensions)}

CANDIDATE SUBMISSION:
Requirements Understanding: ${submission.requirementsUnderstanding}
Assumptions: ${JSON.stringify(submission.assumptions)}
Classes: ${JSON.stringify(submission.classes)}
Relationships: ${JSON.stringify(submission.relationships)}
Design Decisions / Trade-offs: ${JSON.stringify(submission.designDecisions)}
Edge Cases: ${JSON.stringify(submission.edgeCases)}
`;
  }
}

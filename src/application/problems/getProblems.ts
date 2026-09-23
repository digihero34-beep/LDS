import { IProblemRepository } from '@/domain/repositories';
import { ProblemSnapshot } from '@/domain/problem/types';

export class GetProblemsUseCase {
  constructor(private readonly problemRepo: IProblemRepository) {}

  async execute(): Promise<ProblemSnapshot[]> {
    const problems = await this.problemRepo.findAll();
    return problems.map((p) => p.toSnapshot());
  }
}

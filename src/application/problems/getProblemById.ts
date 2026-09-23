import { IProblemRepository } from '@/domain/repositories';
import { ProblemSnapshot } from '@/domain/problem/types';

export class GetProblemByIdUseCase {
  constructor(private readonly problemRepo: IProblemRepository) {}

  async execute(idOrSlug: string): Promise<ProblemSnapshot | null> {
    let problem = await this.problemRepo.findById(idOrSlug);
    if (!problem) {
      problem = await this.problemRepo.findBySlug(idOrSlug);
    }
    return problem ? problem.toSnapshot() : null;
  }
}

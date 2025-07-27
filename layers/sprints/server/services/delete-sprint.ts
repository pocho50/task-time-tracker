import type { SprintRepository } from '../repository/sprint';
import type { Sprint } from '@prisma/client';

export class DeleteSprintService {
  constructor(private repo: SprintRepository) {}

  async execute(id: string): Promise<Sprint> {
    return this.repo.delete(id);
  }
}

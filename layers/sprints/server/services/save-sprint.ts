import type { SprintRepository } from '../repository/sprint';
import type { Sprint, SprintStatus } from '@prisma/client';

export class SaveSprintService {
  constructor(private repo: SprintRepository) {}

  async execute(
    id: string | undefined,
    name: string,
    startDate: string | undefined,
    endDate: string | undefined,
    status: SprintStatus,
    projectId: string
  ): Promise<Sprint> {
    return this.repo.save({
      id,
      name,
      startDate,
      endDate,
      status,
      projectId,
    });
  }
}

import type { ProjectRepository } from '../repository/project';
import type { Project } from '@prisma/client';

export class SaveProjectsService {
  constructor(private repo: ProjectRepository) {}

  async execute(
    id: string | undefined,
    name: string,
    description: string,
    userId: string
  ) {
    return this.repo.save({
      id,
      name,
      description,
      userId,
    });
  }
}

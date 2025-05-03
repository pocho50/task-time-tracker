import type { ProjectRepository } from '../repository/project';

export class DeleteProjectsService {
  constructor(private repo: ProjectRepository) {}

  async execute(id: string) {
    return this.repo.delete(id);
  }
}

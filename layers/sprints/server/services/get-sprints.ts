import { SprintRepository } from '../repository/sprint';

interface GetSprintsInput {
  projectId: string;
}

export class GetSprintsService {
  constructor(private repo: SprintRepository) {}

  async execute({ projectId }: GetSprintsInput) {
    const [total, sprints] = await Promise.all([
      this.repo.countSprintsByProjectId(projectId),
      this.repo.findManyByProjectId(projectId),
    ]);

    return {
      data: sprints,
      meta: {
        total,
      },
    };
  }
}

import { SprintRepository } from '../repository/sprint';

interface GetSprintsInput {
  projectId: string;
  page: number;
  pageSize: number;
}

export class GetSprintsService {
  constructor(private repo: SprintRepository) {}

  async execute({ projectId, page, pageSize }: GetSprintsInput) {
    const [total, sprints] = await Promise.all([
      this.repo.countSprintsByProjectId(projectId),
      this.repo.findManyByProjectId(projectId, page, pageSize),
    ]);

    return {
      data: sprints,
      pagination: {
        total,
        page,
        pageSize,
        pageCount: Math.ceil(total / pageSize),
      },
    };
  }
}

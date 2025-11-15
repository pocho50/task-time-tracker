import { SprintRepository } from '../repository/sprint';

interface GetSprintsInput {
  projectId: string;
  page: number;
  pageSize?: number;
}

export class GetSprintsService {
  constructor(private repo: SprintRepository) {}

  async execute({ projectId, page, pageSize }: GetSprintsInput) {
    const [total, sprints] = await Promise.all([
      this.repo.countSprintsByProjectId(projectId),
      this.repo.findManyByProjectId(projectId, page, pageSize),
    ]);

    // If no pageSize (fetch all), set pageCount to 1
    const effectivePageSize = pageSize || total;
    const pageCount = pageSize ? Math.ceil(total / pageSize) : 1;

    return {
      data: sprints,
      pagination: {
        total,
        page,
        pageSize: effectivePageSize,
        pageCount,
      },
    };
  }
}

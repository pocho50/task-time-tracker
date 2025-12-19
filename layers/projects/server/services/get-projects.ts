import type { ProjectRepository } from '../repository/project';

interface GetProjectsInput {
  userId: string;
  isAdmin: boolean;
  page: number;
  pageSize?: number;
}

export class GetProjectsService {
  constructor(private repo: ProjectRepository) {}

  async execute({ userId, isAdmin, page, pageSize }: GetProjectsInput) {
    const skip = pageSize ? (page - 1) * pageSize : 0;

    const [total, projects] = await Promise.all(
      isAdmin
        ? [this.repo.countAllProjects(), this.repo.findManyAll(skip, pageSize)]
        : [
            this.repo.countProjectsForUser(userId),
            this.repo.findManyForUser(userId, skip, pageSize),
          ]
    );
    return {
      data: projects,
      pagination: {
        total,
        page,
        pageSize: pageSize || total,
        pageCount: pageSize ? Math.ceil(total / pageSize) : 1,
      },
    };
  }
}

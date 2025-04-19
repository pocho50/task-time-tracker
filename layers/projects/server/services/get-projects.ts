import { Project } from "../repositories/project";

interface GetProjectsInput {
  userId: string;
  page: number;
  pageSize: number;
}

export class GetProjectsService {
  constructor(private repo: Project) {}

  async execute({ userId, page, pageSize }: GetProjectsInput) {
    const skip = (page - 1) * pageSize;
    const [total, projects] = await Promise.all([
      this.repo.countProjectsForUser(userId),
      this.repo.findManyForUser(userId, skip, pageSize),
    ]);
    return {
      data: projects,
      pagination: {
        total,
        page,
        pageSize,
        pageCount: Math.ceil(total / pageSize),
      },
    };
  }
}

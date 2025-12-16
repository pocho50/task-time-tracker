import type { TimeTrackRepository } from '../repository/time-track';

interface GetWorkingTasksInput {
  page: number;
  pageSize: number;
}

export class GetWorkingTasksService {
  constructor(private repo: TimeTrackRepository) {}

  async execute({ page, pageSize }: GetWorkingTasksInput) {
    const skip = (page - 1) * pageSize;

    const [total, sessions] = await Promise.all([
      this.repo.countActiveSessions(),
      this.repo.findManyActiveSessions(skip, pageSize),
    ]);

    return {
      data: sessions,
      pagination: {
        total,
        page,
        pageSize,
        pageCount: Math.ceil(total / pageSize),
      },
    };
  }
}

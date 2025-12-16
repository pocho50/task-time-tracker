import type { TaskRepository } from '../repository/task';

interface GetWorkingTasksInput {
  page: number;
  pageSize: number;
}

export class GetWorkingTasksService {
  constructor(private repo: TaskRepository) {}

  async execute({ page, pageSize }: GetWorkingTasksInput) {
    const skip = (page - 1) * pageSize;

    const [total, tasks] = await Promise.all([
      this.repo.countWorkingTasks(),
      this.repo.findManyWorkingWithUserDataAndTimeTracks(skip, pageSize),
    ]);

    return {
      data: tasks,
      pagination: {
        total,
        page,
        pageSize,
        pageCount: Math.ceil(total / pageSize),
      },
    };
  }
}

import { TaskRepository } from '../repository/task';

interface GetTasksInput {
  sprintId: string;
  page: number;
  pageSize: number;
}

export class GetTasksService {
  constructor(private repo: TaskRepository) {}

  async execute({ sprintId, page, pageSize }: GetTasksInput) {
    const skip = (page - 1) * pageSize;
    const [total, tasks] = await Promise.all([
      this.repo.countTasksForSprint(sprintId),
      this.repo.findManyForSprintWithUserData(sprintId, skip, pageSize),
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

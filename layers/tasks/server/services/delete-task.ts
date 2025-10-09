import type { TaskRepository } from '../repository/task';
import type { Task } from '@prisma/client';

export class DeleteTaskService {
  constructor(private repo: TaskRepository) {}

  async execute(id: string): Promise<Task | null> {
    return this.repo.delete(id);
  }
}

import { TaskPriority, TaskStatus } from '@prisma/client';
import { TaskRepository } from '../repository/task';
import type { TaskWithUsers } from '../../shared/types';

export class SaveTasksService {
  constructor(private taskRepository: TaskRepository) {}

  async execute(
    id: string | undefined,
    name: string,
    description: string | null,
    projectId: string,
    sprintId: string | undefined,
    priority: TaskPriority,
    status: TaskStatus,
    estimatedHours: number | null | undefined,
    usersId: string[]
  ): Promise<TaskWithUsers> {
    return await this.taskRepository.save(
      id,
      name,
      description,
      projectId,
      sprintId,
      priority,
      status,
      estimatedHours,
      usersId
    );
  }
}

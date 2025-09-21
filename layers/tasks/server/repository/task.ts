import { PrismaClient, TaskPriority, TaskStatus } from '@prisma/client';
import type { TaskWithUsers, TaskWithUsersData, TaskWithUsersAndTimeTracks } from '../../shared/types';

export class TaskRepository {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  async countTasksForSprint(sprintId: string): Promise<number> {
    return this.prisma.task.count({
      where: {
        sprintId,
      },
    });
  }

  async findManyForSprint(
    sprintId: string,
    skip: number,
    take: number
  ): Promise<TaskWithUsers[]> {
    const tasks = await this.prisma.task.findMany({
      skip,
      take,
      where: {
        sprintId,
      },
      include: {
        users: {
          select: { userId: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tasks.map((task) => {
      return {
        ...task,
        users: undefined,
        usersId: task.users.map((user) => user.userId),
      };
    });
  }

  async findManyForSprintWithUserData(
    sprintId: string,
    skip: number,
    take: number
  ): Promise<TaskWithUsersData[]> {
    const tasks = await this.prisma.task.findMany({
      skip,
      take,
      where: {
        sprintId,
      },
      include: {
        users: {
          include: {
            user: {
              select: { 
                id: true, 
                name: true, 
                email: true 
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tasks.map((task) => {
      const { users: taskUsers, ...taskData } = task;
      return {
        ...taskData,
        usersId: taskUsers.map((tu) => tu.userId),
        users: taskUsers.map((tu) => tu.user),
      };
    });
  }

  async findManyForSprintWithUserDataAndTimeTracks(
    sprintId: string,
    skip: number,
    take: number
  ): Promise<TaskWithUsersAndTimeTracks[]> {
    const tasks = await this.prisma.task.findMany({
      skip,
      take,
      where: {
        sprintId,
      },
      include: {
        users: {
          include: {
            user: {
              select: { 
                id: true, 
                name: true, 
                email: true 
              },
            },
          },
        },
        timeTracking: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tasks.map((task) => {
      const { users: taskUsers, timeTracking, ...taskData } = task;
      return {
        ...taskData,
        usersId: taskUsers.map((tu: any) => tu.userId),
        users: taskUsers.map((tu: any) => tu.user),
        timeTracking,
      };
    });
  }

  async isUserInProject(userId: string, projectId: string): Promise<boolean> {
    const count = await this.prisma.project.count({
      where: {
        id: projectId,
        users: {
          some: {
            userId,
          },
        },
      },
    });

    return count > 0;
  }

  async isUserInTask(userId: string, taskId: string): Promise<boolean> {
    const count = await this.prisma.tasksOnUsers.count({
      where: {
        taskId,
        userId,
      },
    });

    return count > 0;
  }

  async isUserInSprint(userId: string, sprintId: string): Promise<boolean> {
    const count = await this.prisma.sprint.count({
      where: {
        id: sprintId,
        project: {
          users: {
            some: {
              userId,
            },
          },
        },
      },
    });

    return count > 0;
  }

  async save(
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
    const taskData = {
      name,
      description,
      projectId,
      sprintId,
      priority,
      status,
      estimatedHours: estimatedHours ?? null,
    };

    if (id) {
      // Update existing task
      const updatedTask = await this.prisma.task.update({
        where: { id },
        data: taskData,
        include: {
          users: {
            select: { userId: true },
          },
        },
      });

      // Update task users
      await this.prisma.tasksOnUsers.deleteMany({
        where: { taskId: id },
      });

      if (usersId.length > 0) {
        await this.prisma.tasksOnUsers.createMany({
          data: usersId.map((userId) => ({
            taskId: id,
            userId,
          })),
        });
      }

      const { users, ...taskWithoutUsers } = updatedTask;
      return {
        ...taskWithoutUsers,
        usersId,
      };
    } else {
      // Create new task
      const newTask = await this.prisma.task.create({
        data: taskData,
        include: {
          users: {
            select: { userId: true },
          },
        },
      });

      // Add task users
      if (usersId.length > 0) {
        await this.prisma.tasksOnUsers.createMany({
          data: usersId.map((userId) => ({
            taskId: newTask.id,
            userId,
          })),
        });
      }

      const { users, ...taskWithoutUsers } = newTask;
      return {
        ...taskWithoutUsers,
        usersId,
      };
    }
  }
}

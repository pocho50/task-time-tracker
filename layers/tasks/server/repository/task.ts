import { PrismaClient, type Task } from '@prisma/client';

export interface TaskWithUsers extends Task {
  usersId: string[];
}

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
}

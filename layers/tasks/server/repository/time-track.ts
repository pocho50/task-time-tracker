import { PrismaClient } from '@prisma/client';
import type { TimeTrackWithUser } from '../../shared/types';

export class TimeTrackRepository {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  async findManyByTaskId(taskId: string): Promise<TimeTrackWithUser[]> {
    const timeTracks = await this.prisma.timeTrack.findMany({
      where: {
        taskId,
      },
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
    });

    return timeTracks;
  }

  async isUserInTask(userId: string, taskId: string): Promise<boolean> {
    const count = await this.prisma.task.count({
      where: {
        id: taskId,
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

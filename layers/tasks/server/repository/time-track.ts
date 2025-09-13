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

  async create(data: {
    taskId: string;
    userId: string;
    start: Date;
    end?: Date;
    notes?: string;
  }): Promise<TimeTrackWithUser> {
    const timeTrack = await this.prisma.timeTrack.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return timeTrack;
  }

  async update(
    id: string,
    data: {
      start?: Date;
      end?: Date;
      notes?: string;
    }
  ): Promise<TimeTrackWithUser> {
    const timeTrack = await this.prisma.timeTrack.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return timeTrack;
  }

  async findById(id: string): Promise<TimeTrackWithUser | null> {
    return this.prisma.timeTrack.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findActiveByUserAndTask(userId: string, taskId: string): Promise<TimeTrackWithUser | null> {
    return this.prisma.timeTrack.findFirst({
      where: {
        userId,
        taskId,
        end: null, // Active session
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
    });
  }
}

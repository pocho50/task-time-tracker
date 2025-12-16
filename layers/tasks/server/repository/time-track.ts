import { PrismaClient } from '@prisma/client';
import type { TimeTrackWithUser, WorkingSession } from '../../shared/types';

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

  async countActiveSessions(): Promise<number> {
    return this.prisma.timeTrack.count({
      where: {
        end: null,
      },
    });
  }

  async findManyActiveSessions(
    skip: number,
    take: number
  ): Promise<WorkingSession[]> {
    const activeSessions = await this.prisma.timeTrack.findMany({
      skip,
      take,
      where: {
        end: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        task: {
          select: {
            id: true,
            name: true,
            description: true,
            project: {
              select: {
                id: true,
                name: true,
              },
            },
            sprint: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        start: 'desc',
      },
    });

    const pairs = new Map<string, { taskId: string; userId: string }>();
    for (const session of activeSessions) {
      const key = `${session.taskId}:${session.userId}`;
      if (!pairs.has(key)) {
        pairs.set(key, { taskId: session.taskId, userId: session.userId });
      }
    }

    const pairList = Array.from(pairs.values());
    if (pairList.length === 0) {
      return [];
    }

    const completedTracks = await this.prisma.timeTrack.findMany({
      where: {
        end: {
          not: null,
        },
        OR: pairList,
      },
      select: {
        taskId: true,
        userId: true,
        start: true,
        end: true,
      },
    });

    const accumulatedByPair = new Map<string, number>();
    for (const track of completedTracks) {
      if (!track.end) continue;
      const key = `${track.taskId}:${track.userId}`;
      const seconds = Math.max(
        0,
        Math.floor((track.end.getTime() - track.start.getTime()) / 1000)
      );
      accumulatedByPair.set(key, (accumulatedByPair.get(key) ?? 0) + seconds);
    }

    return activeSessions.map((session) => {
      const key = `${session.taskId}:${session.userId}`;
      return {
        ...session,
        accumulatedSeconds: accumulatedByPair.get(key) ?? 0,
      };
    });
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

  async findActiveByUserAndTask(
    userId: string,
    taskId: string
  ): Promise<TimeTrackWithUser | null> {
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

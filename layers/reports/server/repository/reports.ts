import { PrismaClient, type Prisma } from '@prisma/client';

export interface UserHoursStat {
  user: { id: string; name: string; email: string };
  hours: number;
}

export interface UserTasksStat {
  user: { id: string; name: string; email: string };
  tasks: number;
}

export interface UserRatioStat {
  user: { id: string; name: string; email: string };
  ratio: number;
}

export class ReportsRepository {
  private prisma: PrismaClient | Prisma.TransactionClient;

  constructor(prisma?: PrismaClient | Prisma.TransactionClient) {
    this.prisma = prisma || new PrismaClient();
  }

  async isUserInProject(userId: string, projectId: string): Promise<boolean> {
    const count = await this.prisma.projectsOnUsers.count({
      where: {
        userId,
        projectId,
      },
    });

    return count > 0;
  }

  async getHoursWorkedByUser(params: {
    projectId: string;
    from: Date;
    to: Date;
    now: Date;
  }): Promise<UserHoursStat[]> {
    const toEffective = params.to;

    const tracks = await this.prisma.timeTrack.findMany({
      where: {
        task: {
          projectId: params.projectId,
        },
        start: {
          lt: toEffective,
        },
        OR: [
          { end: null },
          {
            end: {
              gt: params.from,
            },
          },
        ],
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
        start: 'asc',
      },
    });

    const byUser = new Map<string, UserHoursStat>();

    for (const track of tracks) {
      const trackEnd = track.end ? track.end : params.now;
      const endEffective = new Date(
        Math.min(trackEnd.getTime(), toEffective.getTime())
      );
      const startEffective = new Date(
        Math.max(track.start.getTime(), params.from.getTime())
      );

      if (endEffective.getTime() <= startEffective.getTime()) continue;

      const seconds =
        (endEffective.getTime() - startEffective.getTime()) / 1000;
      const hours = seconds / 3600;

      const current = byUser.get(track.user.id);
      if (current) {
        current.hours += hours;
      } else {
        byUser.set(track.user.id, {
          user: track.user,
          hours,
        });
      }
    }

    return [...byUser.values()].sort((a, b) => b.hours - a.hours);
  }

  async getFinalizedTasksByUser(params: {
    projectId: string;
    from: Date;
    to: Date;
  }): Promise<UserTasksStat[]> {
    const assignments = await this.prisma.tasksOnUsers.findMany({
      where: {
        task: {
          projectId: params.projectId,
          status: 'FINALIZED',
          createdAt: {
            gte: params.from,
            lt: params.to,
          },
        },
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

    const byUser = new Map<string, UserTasksStat>();

    for (const row of assignments) {
      const current = byUser.get(row.user.id);
      if (current) {
        current.tasks += 1;
      } else {
        byUser.set(row.user.id, {
          user: row.user,
          tasks: 1,
        });
      }
    }

    return [...byUser.values()].sort((a, b) => b.tasks - a.tasks);
  }
}

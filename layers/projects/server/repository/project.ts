import { PrismaClient } from '@prisma/client';

export class Project {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  async countProjectsForUser(userId: string): Promise<number> {
    return this.prisma.project.count({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
    });
  }

  async findManyForUser(userId: string, skip: number, take: number): Promise<any[]> {
    return this.prisma.project.findMany({
      skip,
      take,
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

import { PrismaClient, type Project } from "@prisma/client";

export class ProjectRepository {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  async save(data: { id?: string; name: string; description: string }) {
    if (data.id) {
      // Update existing project
      return this.prisma.project.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description,
        },
      });
    } else {
      // Create new project
      return this.prisma.project.create({
        data: {
          name: data.name,
          description: data.description,
        },
      });
    }
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

  async findManyForUser(
    userId: string,
    skip: number,
    take: number
  ): Promise<Project[]> {
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
        createdAt: "desc",
      },
    });
  }
}

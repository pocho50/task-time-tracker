import { PrismaClient, type Sprint } from '@prisma/client';

export class SprintRepository {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  async findManyByProjectId(
    projectId: string
  ): Promise<Sprint[]> {
    const sprints = await this.prisma.sprint.findMany({
      where: {
        projectId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return sprints;
  }

  async countSprintsByProjectId(projectId: string): Promise<number> {
    return this.prisma.sprint.count({
      where: {
        projectId
      }
    });
  }
  
  async isUserInProject(userId: string, projectId: string): Promise<boolean> {
    const count = await this.prisma.projectsOnUsers.count({
      where: {
        userId,
        projectId
      }
    });
    
    return count > 0;
  }
}

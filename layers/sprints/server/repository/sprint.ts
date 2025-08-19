import { PrismaClient, type Sprint, SprintStatus } from '@prisma/client';

export class SprintRepository {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  async findManyByProjectId(
    projectId: string,
    page?: number,
    pageSize?: number
  ): Promise<Sprint[]> {
    const sprints = await this.prisma.sprint.findMany({
      where: {
        projectId
      },
      orderBy: {
        createdAt: 'desc'
      },
      ...(page && pageSize && {
        skip: (page - 1) * pageSize,
        take: pageSize
      })
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

  async save(data: {
    id?: string;
    name: string;
    startDate?: string;
    endDate?: string;
    status: SprintStatus;
    projectId: string;
  }): Promise<Sprint> {
    if (data.id) {
      // Update existing sprint
      return this.prisma.sprint.update({
        where: { id: data.id },
        data: {
          name: data.name,
          startDate: data.startDate ? new Date(data.startDate) : null,
          endDate: data.endDate ? new Date(data.endDate) : null,
          status: data.status,
        },
      });
    } else {
      // Create new sprint
      return this.prisma.sprint.create({
        data: {
          name: data.name,
          startDate: data.startDate ? new Date(data.startDate) : null,
          endDate: data.endDate ? new Date(data.endDate) : null,
          status: data.status,
          projectId: data.projectId,
        },
      });
    }
  }

  async delete(id: string): Promise<Sprint> {
    return this.prisma.sprint.delete({
      where: { id },
    });
  }
}

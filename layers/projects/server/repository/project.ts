import { PrismaClient, type Project } from '@prisma/client';
import type { ProjectWithIdUsers } from '../../utils';

export class ProjectRepository {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  async delete(id: string): Promise<Project> {
    return this.prisma.project.delete({
      where: { id },
    });
  }

  async save(data: {
    id?: string;
    name: string;
    description: string;
    usersId: string[];
  }): Promise<Project> {
    if (data.id) {
      // Update existing project
      const project = await this.prisma.project.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description,
        },
      });
      // delete all users from project
      await this.deleteAllUsersFromProject(project.id);
      // Assign users to the project
      await this.assignUsersToProject(project.id, data.usersId);
      return project;
    } else {
      // Create the project first
      const project = await this.prisma.project.create({
        data: {
          name: data.name,
          description: data.description,
        },
      });
      // Assign users to project
      await this.assignUsersToProject(project.id, data.usersId);
      return project;
    }
  }

  // Assign users to a project
  async assignUsersToProject(
    projectId: string,
    usersId: string[]
  ): Promise<void> {
    await this.prisma.projectsOnUsers.createMany({
      data: usersId.map((userId) => ({
        projectId,
        userId,
      })),
    });
  }

  // delete all users from project
  async deleteAllUsersFromProject(projectId: string): Promise<void> {
    await this.prisma.projectsOnUsers.deleteMany({
      where: { projectId },
    });
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

  async countAllProjects(): Promise<number> {
    return this.prisma.project.count();
  }

  async findManyForUser(
    userId: string,
    skip: number,
    take?: number
  ): Promise<ProjectWithIdUsers[]> {
    const projects = await this.prisma.project.findMany({
      skip,
      take,
      where: {
        users: {
          some: {
            userId,
          },
        },
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

    return projects.map((project) => {
      return {
        ...project,
        users: undefined,
        usersId: project.users.map((user) => user.userId),
      };
    });
  }

  async findManyAll(
    skip: number,
    take?: number
  ): Promise<ProjectWithIdUsers[]> {
    const projects = await this.prisma.project.findMany({
      skip,
      take,
      include: {
        users: {
          select: { userId: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return projects.map((project) => {
      return {
        ...project,
        users: undefined,
        usersId: project.users.map((user) => user.userId),
      };
    });
  }
}

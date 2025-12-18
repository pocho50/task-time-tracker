import { Prisma, PrismaClient } from '@prisma/client';

export class RoleRepository {
  private prisma: PrismaClient | Prisma.TransactionClient;

  constructor(prisma?: PrismaClient | Prisma.TransactionClient) {
    this.prisma = prisma || new PrismaClient();
  }

  async findMany() {
    return this.prisma.role.findMany({
      orderBy: { key: 'asc' },
      select: {
        id: true,
        key: true,
        name: true,
      },
    });
  }

  async findByKey(key: string) {
    return this.prisma.role.findUnique({
      where: { key },
      select: {
        id: true,
        key: true,
        name: true,
      },
    });
  }

  async save(data: { key: string; name: string }) {
    return this.prisma.role.upsert({
      where: { key: data.key },
      update: {
        name: data.name,
      },
      create: {
        key: data.key,
        name: data.name,
      },
      select: {
        id: true,
        key: true,
        name: true,
      },
    });
  }

  async countUsersByRoleKey(key: string) {
    return this.prisma.user.count({
      where: {
        role: key,
      },
    });
  }

  async deleteByKey(key: string) {
    return this.prisma.role.delete({
      where: { key },
      select: {
        id: true,
        key: true,
        name: true,
      },
    });
  }
}

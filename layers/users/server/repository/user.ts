import { PrismaClient, type UserRole, type User } from '@prisma/client';

export class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  // find user by id
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        locale: true,
        theme: true,
        role: true,
      },
    });
  }

  // find all users
  async findMany() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        locale: true,
        theme: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
        locale: true,
        theme: true,
      },
    });
  }

  // save user
  async save(user: User) {
    return this.prisma.user.create({
      data: user,
    });
  }

  // update user
  async update(id: string, userData: Partial<User>) {
    return this.prisma.user.update({
      where: { id },
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        locale: true,
        theme: true,
      },
    });
  }
}

export class UserPermissionRepository {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  async findManyByRole(role: UserRole) {
    return this.prisma.userPermission.findMany({
      where: { role },
    });
  }
}

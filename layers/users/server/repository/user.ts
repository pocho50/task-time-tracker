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

  // find all users (paginated)
  async findMany(skip = 0, take = 100) {
    return this.prisma.user.findMany({
      skip,
      take,
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

  // count all users
  async countUsers() {
    return this.prisma.user.count();
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
  async save(data: {
    id?: string;
    name: string;
    email: string;
    role: UserRole;
    password?: string;
  }) {
    if (data.id) {
      return this.update(data.id, data);
    } else {
      if (!data.password) {
        throw new Error('Password is required');
      }
      const userData = {
        name: data.name,
        email: data.email,
        role: data.role,
        password: await hashPassword(data.password!),
      };
      return this.prisma.user.create({
        data: userData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    }
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

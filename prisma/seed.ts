import { PrismaClient } from '@prisma/client';
import { Hash } from '@adonisjs/hash';
import { Scrypt } from '@adonisjs/hash/drivers/scrypt';
import { PERMISSIONS } from '#layers/shared/utils/permissions';
import { ROLES } from '#layers/shared/utils/constants';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  console.log('Cleaning up existing data...');
  // Disable foreign key checks and truncate all tables
  // Note: In SQLite, PRAGMA foreign_keys is connection-scoped and does not apply
  // reliably when executed inside a Prisma $transaction batch.
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = OFF');
  await prisma.$executeRawUnsafe('DELETE FROM user_permissions');
  await prisma.$executeRawUnsafe('DELETE FROM roles');
  await prisma.$executeRawUnsafe('DELETE FROM time_tracks');
  await prisma.$executeRawUnsafe('DELETE FROM tasks_users');
  await prisma.$executeRawUnsafe('DELETE FROM projects_users');
  await prisma.$executeRawUnsafe('DELETE FROM tasks');
  await prisma.$executeRawUnsafe('DELETE FROM sprints');
  await prisma.$executeRawUnsafe('DELETE FROM projects');
  await prisma.$executeRawUnsafe('DELETE FROM users');
  await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON');
  console.log('Data cleanup completed');

  const scrypt = new Scrypt({});
  const hash = new Hash(scrypt);

  await prisma.role.createMany({
    data: [
      { key: ROLES.ADMIN, name: 'Administrator' },
      { key: ROLES.USER, name: 'User' },
    ],
  });

  // Create admin user
  const adminPassword = await hash.make('admin123');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      name: 'Jose',
      password: adminPassword,
      role: ROLES.ADMIN,
    },
  });

  // Create regular user
  const userPassword = await hash.make('password');
  const regularUser = await prisma.user.create({
    data: {
      email: 'test@test.com',
      name: 'Pedro',
      password: userPassword,
      role: ROLES.USER,
    },
  });

  // Assign permissions by role
  // ADMIN role gets all project permissions (read, write, delete)
  await prisma.userPermission.create({
    data: {
      role: ROLES.ADMIN,
      entity: 'projects',
      permission: PERMISSIONS.PROJECTS_WRITE | PERMISSIONS.PROJECTS_DELETE,
    },
  });
  // ADMIN role gets all users permissions (read, write, delete)
  await prisma.userPermission.create({
    data: {
      role: ROLES.ADMIN,
      entity: 'users',
      permission:
        PERMISSIONS.USERS_READ |
        PERMISSIONS.USERS_WRITE |
        PERMISSIONS.USERS_DELETE,
    },
  });

  // ADMIN role gets all roles permissions (read, write, delete)
  await prisma.userPermission.create({
    data: {
      role: ROLES.ADMIN,
      entity: 'roles',
      permission:
        PERMISSIONS.ROLES_READ |
        PERMISSIONS.ROLES_WRITE |
        PERMISSIONS.ROLES_DELETE,
    },
  });

  await prisma.userPermission.create({
    data: {
      role: ROLES.ADMIN,
      entity: 'sprints',
      permission: PERMISSIONS.SPRINTS_WRITE | PERMISSIONS.SPRINTS_DELETE,
    },
  });

  await prisma.userPermission.create({
    data: {
      role: ROLES.ADMIN,
      entity: 'tasks',
      permission: PERMISSIONS.TASKS_WRITE | PERMISSIONS.TASKS_DELETE,
    },
  });

  await prisma.userPermission.create({
    data: {
      role: ROLES.ADMIN,
      entity: 'working',
      permission: PERMISSIONS.WORKING_READ,
    },
  });

  // Create a project
  const project = await prisma.project.create({
    data: {
      name: 'Task Time Tracker',
      description: 'Descripcion',
      users: {
        create: [
          {
            userId: admin.id,
            assignedAt: new Date(),
          },
          {
            userId: regularUser.id,
            assignedAt: new Date(),
          },
        ],
      },
    },
  });

  // Create a sprint
  const sprint = await prisma.sprint.create({
    data: {
      name: 'Sprint 1',
      projectId: project.id,
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    },
  });

  // Create some tasks
  const task1 = await prisma.task.create({
    data: {
      name: 'Setup Project Structure',
      description: 'Initial project setup including Prisma, Nuxt, and DaisyUI',
      projectId: project.id,
      sprintId: sprint.id,
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      estimatedHours: 8,
      users: {
        create: {
          userId: admin.id,
          assignedAt: new Date(),
        },
      },
    },
  });

  const task2 = await prisma.task.create({
    data: {
      name: 'User Authentication',
      description: 'Implement user authentication and authorization',
      projectId: project.id,
      sprintId: sprint.id,
      priority: 'HIGH',
      status: 'ANALYZING',
      estimatedHours: 16,
      users: {
        create: [
          {
            userId: admin.id,
            assignedAt: new Date(),
          },
          {
            userId: regularUser.id,
            assignedAt: new Date(),
          },
        ],
      },
    },
  });

  // Create some time tracking entries
  await prisma.timeTrack.create({
    data: {
      taskId: task1.id,
      userId: admin.id,
      start: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      end: new Date(),
      notes: 'Initial project setup completed',
    },
  });

  await prisma.timeTrack.create({
    data: {
      taskId: task2.id,
      userId: regularUser.id,
      start: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
      end: new Date(),
      notes: 'Started working on authentication flow',
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

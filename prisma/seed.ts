import { PrismaClient } from '@prisma/client';
import { Hash } from '@adonisjs/hash';
import { Scrypt } from '@adonisjs/hash/drivers/scrypt';
import { PERMISSIONS } from '#layers/shared/utils/permissions';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  console.log('Cleaning up existing data...');
  // Disable foreign key checks and truncate all tables
  await prisma.$transaction([
    prisma.$executeRaw`PRAGMA foreign_keys = OFF`,
    prisma.$executeRaw`DELETE FROM user_permissions`,
    prisma.$executeRaw`DELETE FROM time_tracks`,
    prisma.$executeRaw`DELETE FROM tasks_users`,
    prisma.$executeRaw`DELETE FROM projects_users`,
    prisma.$executeRaw`DELETE FROM tasks`,
    prisma.$executeRaw`DELETE FROM sprints`,
    prisma.$executeRaw`DELETE FROM projects`,
    prisma.$executeRaw`DELETE FROM users`,
    prisma.$executeRaw`PRAGMA foreign_keys = ON`,
  ]);
  console.log('Data cleanup completed');

  const scrypt = new Scrypt({});
  const hash = new Hash(scrypt);

  // Create admin user
  const adminPassword = await hash.make('admin123');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create regular user
  const userPassword = await hash.make('password');
  const regularUser = await prisma.user.create({
    data: {
      email: 'test@test.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  });

  // Assign permissions by role
  // ADMIN role gets all project permissions (read, write, delete)
  await prisma.userPermission.create({
    data: {
      role: 'ADMIN',
      entity: 'projects',
      permission:
        PERMISSIONS.PROJECTS_READ |
        PERMISSIONS.PROJECTS_WRITE |
        PERMISSIONS.PROJECTS_DELETE,
    },
  });
  // USER role gets only read permission for projects
  await prisma.userPermission.create({
    data: {
      role: 'USER',
      entity: 'projects',
      permission: PERMISSIONS.PROJECTS_READ,
    },
  });

  // Create a project
  const project = await prisma.project.create({
    data: {
      name: 'Time Tracker Development',
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
  // create 18 additional projects
  for (let i = 1; i <= 18; i++) {
    const projectName = `Project ${i}`;
    const projectDescription = `Description ${i}`;

    const additionalProject = await prisma.project.create({
      data: {
        name: projectName,
        description: projectDescription,
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
  }

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

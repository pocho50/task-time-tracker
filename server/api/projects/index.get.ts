import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const DEFAULT_PAGE_SIZE = 12;
  const pageSize = Number(query.pageSize) || DEFAULT_PAGE_SIZE;
  const skip = (page - 1) * pageSize;

  const prisma = new PrismaClient();

  const [total, projects] = await prisma.$transaction([
    prisma.project.count(),
    prisma.project.findMany({
      skip,
      take: pageSize,
      where: {
        users: {
          some: {
            userId: user.id,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return {
    data: projects,
    pagination: {
      total,
      page,
      pageSize,
      pageCount: Math.ceil(total / pageSize),
    },
  };
});

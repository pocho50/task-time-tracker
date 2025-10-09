import { TaskRepository } from '../../repository/task';
import { GetTasksService } from '../../services/get-tasks';
import { DEFAULT_PAGE_SIZE } from '../../constants';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Get translation function for server-side
  const t = await useTranslation(event);

  const query = getQuery(event);
  const sprintId = query.sprintId as string;
  const page = Number(query.page) || 1;
  const pageSizeParam = Number(query.pageSize);
  // Handle Infinity pageSize to fetch all tasks
  const pageSize =
    pageSizeParam === Infinity
      ? Number.MAX_SAFE_INTEGER
      : pageSizeParam || DEFAULT_PAGE_SIZE;

  // Validate sprintId is provided
  if (!sprintId) {
    throw createError({
      statusCode: 400,
      message: t('server.sprintIdRequired'),
    });
  }

  const repo = new TaskRepository();

  // Check if user has access to this sprint (admins always have access)
  const hasAccess =
    user.role === 'ADMIN' || (await repo.isUserInSprint(user.id, sprintId));

  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      message: t('server.unauthorizedAccess'),
    });
  }

  try {
    const service = new GetTasksService(repo);
    return service.execute({
      sprintId,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw createError({
      statusCode: 500,
      message: t('server.errorFetching'),
    });
  }
});

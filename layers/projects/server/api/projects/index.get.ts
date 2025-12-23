import { ProjectRepository } from '../../repository/project';
import { GetProjectsService } from '../../services/get-projects';
import { DEFAULT_PAGE_SIZE } from '../../constants';
import { ROLES } from '#layers/shared/utils/constants';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Get translation function for server-side
  const t = await useTranslation(event);

  const query = getQuery(event);
  const page = Number(query.page) || 1;

  // Handle pageSize parameter
  // - If not provided: use DEFAULT_PAGE_SIZE
  // - If Infinity: use undefined to fetch all records
  // - Otherwise: use the provided value
  const rawPageSize = query.pageSize ? Number(query.pageSize) : null;
  const pageSize =
    rawPageSize === null
      ? DEFAULT_PAGE_SIZE
      : !isFinite(rawPageSize)
        ? undefined
        : rawPageSize;

  try {
    const repo = new ProjectRepository();
    const service = new GetProjectsService(repo);
    return service.execute({
      userId: user.id,
      isAdmin: user.role === ROLES.ADMIN,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw createError({
      statusCode: 500,
      message: t('server.errorFetching'),
    });
  }
});

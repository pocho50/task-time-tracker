import { ProjectRepository } from '../../repository/project';
import { GetProjectsService } from '../../services/get-projects';
import { DEFAULT_PAGE_SIZE } from '../../constants';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Get translation function for server-side
  const t = await useTranslation(event);

  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const pageSizeParam = Number(query.pageSize);
  // Handle Infinity pageSize to fetch all projects
  const pageSize =
    pageSizeParam === Infinity
      ? Number.MAX_SAFE_INTEGER
      : pageSizeParam || DEFAULT_PAGE_SIZE;

  try {
    const repo = new ProjectRepository();
    const service = new GetProjectsService(repo);
    return service.execute({
      userId: user.id,
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

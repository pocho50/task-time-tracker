import { SprintRepository } from '../../repository/sprint';
import { GetSprintsService } from '../../services/get-sprints';
import { DEFAULT_PAGE_SIZE } from '../../constants';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Get translation function for server-side
  const t = await useTranslation(event);

  // Get the project ID and pagination params from the query
  const query = getQuery(event);
  const idProject = query.id_project as string;
  const page = Number(query.page) || 1;
  const pageSize = Number(query.pageSize) || DEFAULT_PAGE_SIZE;

  if (!idProject) {
    throw createError({
      statusCode: 400,
      message: t('server.invalidProjectId'),
    });
  }

  try {
    const repo = new SprintRepository();

    // Check if user has access to this project
    const hasAccess = await repo.isUserInProject(user.id, idProject);

    if (!hasAccess) {
      throw createError({
        statusCode: 401,
        message: t('server.unauthorizedAccess'),
      });
    }

    const service = new GetSprintsService(repo);

    return service.execute({
      projectId: idProject,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('Error fetching sprints:', error);
    throw createError({
      statusCode: 500,
      message: t('server.errorFetching'),
    });
  }
});

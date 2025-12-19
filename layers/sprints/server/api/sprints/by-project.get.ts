import { SprintRepository } from '../../repository/sprint';
import { GetSprintsService } from '../../services/get-sprints';
import { DEFAULT_PAGE_SIZE } from '../../constants';
import { assertUserInProjectOrAdminOrThrow } from '#layers/shared/server/utils';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Get translation function for server-side
  const t = await useTranslation(event);

  // Get the project ID and pagination params from the query
  const query = getQuery(event);
  const idProject = query.id_project as string;
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

  if (!idProject) {
    throw createError({
      statusCode: 400,
      message: t('server.invalidProjectId'),
    });
  }

  const repo = new SprintRepository();

  await assertUserInProjectOrAdminOrThrow({
    userId: user.id,
    userRole: user.role,
    projectId: idProject,
    isUserInProject: repo.isUserInProject.bind(repo),
    errorMessage: t('server.unauthorizedAccess'),
  });

  try {
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

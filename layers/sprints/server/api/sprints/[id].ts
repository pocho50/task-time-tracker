import { SprintRepository } from '../../repository/sprint';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // Get translation function for server-side
  const t = await useTranslation(event);

  // Get the sprint ID from the route params
  const sprintId = getRouterParam(event, 'id');

  if (!sprintId) {
    throw createError({
      statusCode: 400,
      message: t('server.invalidSprintId'),
    });
  }

  try {
    const repo = new SprintRepository();

    // Get the sprint by ID
    const sprint = await repo.getById(sprintId);

    if (!sprint) {
      throw createError({
        statusCode: 404,
        message: t('server.sprintNotFound'),
      });
    }

    // Check if user has access to this sprint's project
    const hasAccess = await repo.isUserInProject(user.id, sprint.projectId);

    if (!hasAccess) {
      throw createError({
        statusCode: 401,
        message: t('server.unauthorizedAccess'),
      });
    }

    return sprint;
  } catch (error) {
    console.error('Error fetching sprint:', error);
    throw createError({
      statusCode: 500,
      message: t('server.errorFetching'),
    });
  }
});
